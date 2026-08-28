"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ResetPasswordDialog from "./ResetPasswordDialog";

interface ProfileFormValues {
  displayName: string;
  email: string;
}

const AccountTab = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);
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

  return (
    <div className="flex gap-4 w-full h-full">
      <div className="flex flex-col h-full bg-[#FFFFFF] shadow-xs border border-gray-100 rounded-lg p-6 w-2/3">
        <span className="font-semibold text-2xl text-[#2C2F33]">Profile</span>
        <div className="mt-4 grid max-w-xl gap-4">
          <div className="grid gap-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center sm:gap-4">
            <Label htmlFor="accountEmail">Email</Label>
            <Input
              id="accountEmail"
              type="email"
              {...register("email")}
              disabled
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center sm:gap-4">
            <Label>Password</Label>
            <ResetPasswordDialog hasPassword={Boolean(user?.hasPassword)} />
          </div>
        </div>

        <span className="font-semibold text-2xl text-[#2C2F33]">
          Basic Information
        </span>

        <form
          className="mt-4 grid max-w-xl gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="grid gap-2">
            <Label htmlFor="displayName">Display name</Label>
            <Input id="displayName" {...register("displayName")} />
          </div>
        </form>

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
