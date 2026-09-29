import SettingsTabs from "@/components/client/main/setting/SettingsTabs";
import AccountTab from "@/components/client/main/setting/AccountTab";
import VerificationArtist from "@/components/client/main/setting/VerificationArtist";
import VerificationGuidelines from "@/components/client/main/setting/VerificationGuidelines";
import VerificationSection from "@/components/client/main/setting/VerificationSection";
import { Suspense } from "react";

export default function SettingPage() {
  return (
    <Suspense
      fallback={
        <div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-muted" />
      }
    >
      <SettingsTabs>
        <AccountTab
          verification={
            <VerificationSection
              dialog={
                <VerificationArtist>
                  <VerificationGuidelines />
                </VerificationArtist>
              }
            />
          }
        />
      </SettingsTabs>
    </Suspense>
  );
}
