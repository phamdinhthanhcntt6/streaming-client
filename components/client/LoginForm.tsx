/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
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
      setError("");

      const data = await authService.login(values);

      if (data?.accessToken) {
        localStorage.setItem("access_token", data.accessToken);
      }

      router.push("/home");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.",
      );
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
          className="bg-gray-50 border-gray-200 h-11"
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
          className="bg-gray-50 border-gray-200 h-11"
        />
        {errors.password && (
          <p className="text-sm font-medium text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <Button
        type="submit"
        className="w-full h-11 font-semibold bg-gray-400 hover:bg-gray-500 text-white rounded-md mt-4"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Log in"}
      </Button>

      <div className="mt-4 text-center">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 underline underline-offset-4"
        >
          Forget password?
        </Link>
      </div>
    </form>
  );
}
