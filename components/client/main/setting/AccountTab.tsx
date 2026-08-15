"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ProfileFormValues {
  displayName: string;
  email: string;
}

const AccountTab = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);
  const clearUser = useAuthStore((state) => state.clearUser);
  const { register, reset } = useForm<ProfileFormValues>({
    defaultValues: { displayName: "", email: "" },
  });

  useEffect(() => {
    if (user) {
      reset({ displayName: user.displayName, email: user.email });
    }
  }, [reset, user]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/login");
    }
  }, [authStatus, router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const data = await authService.logout();
      clearUser();

      toast.success(data?.message || "Logged out successfully");
      router.replace("/login");
      router.refresh();
    } catch (error: unknown) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || "Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex gap-4 w-full h-full">
      <div className="flex flex-col h-full bg-[#FFFFFF] shadow-xs border border-gray-100 rounded-lg p-6 w-2/3">
        <span className="font-semibold text-2xl text-[#2C2F33]">Profile</span>
        <span className="font-semibold text-2xl text-[#2C2F33]">
          Basic Information
        </span>

        <form
          className="mt-6 grid max-w-xl gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid gap-2">
            <Label htmlFor="displayName">Display name</Label>
            <Input id="displayName" {...register("displayName")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accountEmail">Email</Label>
            <Input
              id="accountEmail"
              type="email"
              disabled
              {...register("email")}
            />
          </div>
        </form>

        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-4 w-32"
          variant="destructive"
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </Button>
      </div>
      <div className="flex h-full bg-[#FFFFFF] shadow-xs border border-gray-100 rounded-lg p-6 w-1/3">
        <span className="font-semibold text-5 text-[#2C2F33]">
          Login with social networks
        </span>
      </div>
    </div>
  );
};

export default AccountTab;
