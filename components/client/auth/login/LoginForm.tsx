"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiError, getApiErrorMessage } from "@/lib/api-error";
import {
  authService,
  LoginCredentials,
  loginSchema,
} from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginCredentials) => {
    try {
      setIsLoading(true);

      const data = await authService.login(values);
      setUser(data.user);

      toast.success(data?.message || "Login successful");
      router.push("/music");
    } catch (error: unknown) {
      const apiError = getApiError(error);

      for (const fieldError of apiError.errors) {
        if (fieldError.field === "email" || fieldError.field === "password") {
          setError(fieldError.field, { message: fieldError.message });
        }
      }

      toast.error(getApiErrorMessage(error, "Login failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 text-left">
        <Label htmlFor="email" className="font-semibold text-gray-700">
          Email address
        </Label>
        <Input
          id="email"
          placeholder="name@example.com"
          {...register("email")}
          disabled={isLoading}
          className="h-11 border-gray-200 bg-gray-50"
        />
        {errors.email && (
          <p className="text-sm font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2 text-left">
        <Label htmlFor="password" className="font-semibold text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Your password"
          {...register("password")}
          disabled={isLoading}
          className="h-11 border-gray-200 bg-gray-50"
        />
        {errors.password && (
          <p className="text-sm font-medium text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="mt-4 h-11 w-full rounded-md bg-[#A1ABB2] font-semibold text-white hover:bg-gray-500"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Log in"}
      </Button>

      <div className="mt-4 text-center">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-gray-500 underline underline-offset-4 hover:text-gray-900"
        >
          Forget password?
        </Link>
      </div>
    </form>
  );
}
