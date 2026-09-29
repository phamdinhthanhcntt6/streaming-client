"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  verificationKeys,
  verificationService,
  type AdminVerificationRequest,
  type VerificationStatus,
} from "@/services/verification.service";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const filters = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
] as const satisfies ReadonlyArray<{
  label: string;
  value: VerificationStatus;
}>;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function VerificationRequestsTable() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<VerificationStatus>("PENDING");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (authStatus === "unauthenticated") router.replace("/login");
    else if (authStatus === "authenticated" && !isAdmin) router.replace("/");
  }, [authStatus, isAdmin, router]);

  const { data, isPending: isLoading } = useQuery({
    queryKey: verificationKeys.adminList(status),
    queryFn: () => verificationService.listRequests(status),
    enabled: isAdmin,
  });

  const { mutate: review, isPending: isReviewing } = useMutation({
    mutationFn: ({
      id,
      action,
      reviewNote,
    }: {
      id: string;
      action: "APPROVE" | "REJECT";
      reviewNote?: string;
    }) => verificationService.reviewRequest(id, { action, note: reviewNote }),
    onSuccess: async (_request, variables) => {
      toast.success(
        variables.action === "APPROVE"
          ? "Request approved."
          : "Request rejected.",
      );
      setRejectingId(null);
      setNote("");
      // Both the source list and the destination list are now stale.
      await queryClient.invalidateQueries({ queryKey: ["verification"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  if (authStatus !== "authenticated" || !isAdmin) {
    return <div className="h-40 w-full animate-pulse rounded-lg bg-muted" />;
  }

  const requests: AdminVerificationRequest[] = data?.requests ?? [];

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-xs">
      <h1 className="text-2xl font-semibold text-[#2C2F33]">
        Artist verification
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            type="button"
            variant={status === filter.value ? "default" : "ghost"}
            onClick={() => setStatus(filter.value)}
            className="rounded-lg"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-6 h-32 w-full animate-pulse rounded-lg bg-muted" />
      ) : requests.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          No {status.toLowerCase()} requests.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {requests.map((request) => (
            <li
              key={request.id}
              className="rounded-lg border border-gray-100 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="font-semibold text-[#2C2F33]">
                    {request.artistName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {request.user.displayName} ({request.user.email}) &middot;{" "}
                    {formatDate(request.createdAt)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {request.targetArtist
                      ? `Approving claims the catalog artist "${request.targetArtist.name}"`
                      : "Approving creates a new artist profile"}
                  </p>
                  {request.links.length > 0 && (
                    <ul className="space-y-0.5 text-sm">
                      {request.links.map((link) => (
                        <li key={link}>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all text-blue-500 hover:underline"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  {request.reviewNote && (
                    <p className="text-sm text-gray-500">
                      Note: {request.reviewNote}
                    </p>
                  )}
                </div>

                {request.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isReviewing}
                      onClick={() =>
                        setRejectingId((current) =>
                          current === request.id ? null : request.id,
                        )
                      }
                    >
                      Reject
                    </Button>
                    <Button
                      type="button"
                      disabled={isReviewing}
                      onClick={() =>
                        review({ id: request.id, action: "APPROVE" })
                      }
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>

              {rejectingId === request.id && (
                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                  <label
                    htmlFor={`note-${request.id}`}
                    className="text-sm font-medium"
                  >
                    Reason (optional, shown to the requester)
                  </label>
                  <Textarea
                    id={`note-${request.id}`}
                    value={note}
                    maxLength={500}
                    onChange={(event) => setNote(event.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setRejectingId(null);
                        setNote("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      disabled={isReviewing}
                      onClick={() =>
                        review({
                          id: request.id,
                          action: "REJECT",
                          reviewNote: note.trim() || undefined,
                        })
                      }
                    >
                      Confirm reject
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
