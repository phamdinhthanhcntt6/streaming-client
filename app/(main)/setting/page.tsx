import SettingsTabs from "@/components/client/main/setting/SettingsTabs";
import { Suspense } from "react";

export default function SettingPage() {
  return (
    <Suspense fallback={<div className="h-12 w-full animate-pulse rounded-lg bg-muted" />}>
      <SettingsTabs />
    </Suspense>
  );
}
