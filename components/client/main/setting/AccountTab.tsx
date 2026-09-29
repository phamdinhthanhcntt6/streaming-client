"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import DeleteAccountDialog from "./DeleteAccountDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";

interface ProfileFormValues {
  displayName: string;
  email: string;
}

const AccountTab = ({ verification }: { verification: ReactNode }) => {
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
    <div className="flex h-full w-full gap-4">
      <div className="flex h-full w-2/3 flex-col rounded-lg border border-gray-100 bg-[#FFFFFF] p-6 shadow-xs">
        <span className="text-2xl font-semibold text-[#2C2F33]">Profile</span>
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
          <div className="grid gap-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-center sm:gap-4">
            <Label>Verification</Label>
            {verification}
          </div>
        </div>

        <span className="text-2xl font-semibold text-[#2C2F33]">
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
        <DeleteAccountDialog hasPassword={Boolean(user?.hasPassword)} />
      </div>
      <div className="flex h-full w-1/3 rounded-lg border border-gray-100 bg-[#FFFFFF] p-6 shadow-xs">
        <span className="text-5 font-semibold text-[#2C2F33]">
          Login with social networks
        </span>
      </div>
    </div>
  );
};

export default AccountTab;
