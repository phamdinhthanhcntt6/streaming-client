"use client";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  verificationKeys,
  verificationService,
} from "@/services/verification.service";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Clock } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * Chooses between the badge, the pending notice and the request dialog, so the
 * dialog is never offered to someone who already has a request under review.
 */
export default function VerificationSection({ dialog }: { dialog: ReactNode }) {
  const artist = useAuthStore((state) => state.user?.artist ?? null);
  const authStatus = useAuthStore((state) => state.status);
  const queryClient = useQueryClient();

  const { data: request, isPending: isLoading } = useQuery({
    queryKey: verificationKeys.me,
    queryFn: verificationService.getMyRequest,
    // An account that already manages an artist has nothing left to request.
    enabled: authStatus === "authenticated" && !artist,
  });

  const { mutate: cancelRequest, isPending: isCancelling } = useMutation({
    mutationFn: verificationService.cancelMyRequest,
    onSuccess: async () => {
      toast.success("Verification request cancelled.");
      await queryClient.invalidateQueries({ queryKey: verificationKeys.me });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  if (artist) {
    return (
      <p className="flex items-center gap-1.5 text-sm font-medium text-[#1A75FF]">
        <BadgeCheck className="size-4" aria-hidden />
        Verified as {artist.name}
      </p>
    );
  }

  if (authStatus !== "authenticated" || isLoading) {
    return <div className="h-7 w-40 animate-pulse rounded bg-muted" />;
  }

  if (request?.status === "PENDING") {
    return (
      <div className="space-y-1">
        <p className="flex items-center gap-1.5 text-sm text-[#52616B]">
          <Clock className="size-4" aria-hidden />
          Under review since {formatDate(request.createdAt)}
        </p>
        <Button
          type="button"
          variant="ghost"
          disabled={isCancelling}
          onClick={() => cancelRequest()}
          className="h-auto p-0 text-sm text-blue-500 hover:underline"
        >
          {isCancelling ? "Cancelling..." : "Cancel request"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {request?.status === "REJECTED" && (
        <p className="text-sm text-[#52616B]">
          Your previous request was not approved
          {request.reviewNote ? `: ${request.reviewNote}` : "."} You can apply
          again.
        </p>
      )}
      {dialog}
    </div>
  );
}
