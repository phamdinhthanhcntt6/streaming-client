"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Library, Megaphone, Shield, User } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const tabs = [
  { title: "Account", value: "account", icon: User },
  { title: "Content", value: "content", icon: Library },
  { title: "Notifications", value: "notifications", icon: Bell },
  { title: "Privacy", value: "privacy", icon: Shield },
  { title: "Advertising", value: "advertising", icon: Megaphone },
] as const;

const validTabs = new Set<string>(tabs.map((tab) => tab.value));

export default function SettingsTabs({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const activeTab =
    tabFromUrl && validTabs.has(tabFromUrl) ? tabFromUrl : "account";

  useEffect(() => {
    if (tabFromUrl && validTabs.has(tabFromUrl)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "account");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams, tabFromUrl]);

  const handleTabChange = (value: string) => {
    if (!validTabs.has(value)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="mt-4 w-full"
    >
      <TabsList className="grid h-12! w-full grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="hover:decoration-none! transition-none! data-active:bg-[#1A75FF] data-active:font-semibold data-active:text-white"
            >
              <Icon />
              {tab.title}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <div className="mt-4">
        <TabsContent value="account">{children}</TabsContent>
        {tabs.slice(1).map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="rounded-lg border border-gray-100 bg-white p-6 text-gray-500 shadow-xs">
              {tab.title} settings will be available soon.
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
