"use client";

import KeyIcon from "@/components/icons/KeyIcon";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    authService,
    createChangePasswordSchema,
    type ChangePasswordBody,
} from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  hasPassword: boolean;
}

const ResetPasswordDialog = ({ hasPassword }: Props) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const passwordSchema = useMemo(
    () => createChangePasswordSchema(hasPassword),
    [hasPassword],
  );

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordBody>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen && !isSubmitting) {
      reset();
    }
  };

  const onSubmit = async (data: ChangePasswordBody) => {
    const payload: ChangePasswordBody = hasPassword
      ? data
      : {
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        };

    try {
      setIsSubmitting(true);

      const response = await authService.changePassword(payload);

      if (user) {
        setUser({
          ...user,
          hasPassword: response.hasPassword,
        });
      }

      toast.success(response.message);
      reset();
      setOpen(false);
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || "Unable to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-max cursor-pointer rounded-lg border border-gray-100 bg-[#f9f9f9] px-2.5 py-1 text-left text-blue-500 hover:underline ring-0"
      >
        {hasPassword ? "Change password" : "Set password"}
      </button>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <DialogHeader className="flex flex-col text-center items-center">
            <KeyIcon />
            <DialogTitle>
              {hasPassword ? "Change your password" : "Set your password"}
            </DialogTitle>
            <DialogDescription>
              {hasPassword
                ? "Enter your current password, then choose a strong new password."
                : "Create a password so you can also sign in with your email."}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            {hasPassword ? (
              <Field>
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  {...register("currentPassword")}
                />
                {errors.currentPassword ? (
                  <p className="text-sm text-red-500">
                    {errors.currentPassword.message}
                  </p>
                ) : null}
              </Field>
            ) : null}
            <Field>
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register("newPassword")}
              />
              {errors.newPassword ? (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              ) : null}
            </Field>
            <Field>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="bg-[#1A75FF]"
          >
            {isSubmitting
              ? "Saving..."
              : hasPassword
                ? "Change password"
                : "Set password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
