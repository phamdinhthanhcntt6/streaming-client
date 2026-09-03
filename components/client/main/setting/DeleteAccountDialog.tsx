"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiError } from "@/lib/api-error";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface DeleteAccountDialogProps {
  hasPassword: boolean;
}

export default function DeleteAccountDialog({
  hasPassword,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const deleteAccountMutation = useMutation({
    mutationFn: () =>
      authService.deleteAccount(hasPassword ? password : undefined),
    onMutate: () => {
      setPasswordError(null);
    },
    onSuccess: (data) => {
      queryClient.removeQueries();
      clearUser();
      setOpen(false);
      toast.success(data.message);
      router.replace("/login");
      router.refresh();
    },
    onError: (error: unknown) => {
      const apiError = getApiError(error);
      const fieldMessage = apiError.errors.find(
        (item) => item.field === "password",
      )?.message;

      setPasswordError(fieldMessage ?? apiError.message);
      toast.error(apiError.message);
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (deleteAccountMutation.isPending) return;

    setOpen(nextOpen);

    if (!nextOpen) {
      setPassword("");
      setPasswordError(null);
      deleteAccountMutation.reset();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteAccountMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        variant="destructive"
        onClick={() => setOpen(true)}
        className="mx-auto mt-4 w-max bg-[#EBEEF0] font-semibold text-[#EF5350] hover:bg-red-100"
      >
        Delete Account
      </Button>

      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <div className="mb-1 grid size-10 place-items-center rounded-full bg-red-100 text-red-600">
              <TriangleAlert className="size-5" />
            </div>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This action is permanent. Your account and its associated data
              cannot be recovered.
            </DialogDescription>
          </DialogHeader>

          {hasPassword ? (
            <div className="grid gap-2">
              <Label htmlFor="deleteAccountPassword">Current password</Label>
              <Input
                id="deleteAccountPassword"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setPasswordError(null);
                }}
                disabled={deleteAccountMutation.isPending}
                aria-invalid={Boolean(passwordError)}
                aria-describedby={
                  passwordError ? "deleteAccountPasswordError" : undefined
                }
                autoFocus
              />
              {passwordError ? (
                <p
                  id="deleteAccountPasswordError"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {passwordError}
                </p>
              ) : null}
            </div>
          ) : passwordError ? (
            <p role="alert" className="text-sm text-destructive">
              {passwordError}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={deleteAccountMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={deleteAccountMutation.isPending}
              aria-busy={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending
                ? "Deleting..."
                : "Delete account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
