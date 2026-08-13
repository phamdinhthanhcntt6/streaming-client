"use client";

import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AccountTab = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      const data = await authService.logout();
      localStorage.removeItem("access_token");

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
