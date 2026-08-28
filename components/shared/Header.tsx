"use client";

import { LogOut, Menu, Search, Settings, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logo from "./Logo";

const navItems = [
  { label: "Music", href: "/#music" },
  { label: "Video", href: "/#video" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Voting", href: "/voting" },
];

const getInitials = (displayName: string) =>
  displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "U";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const currentUser = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.status);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const clearUser = useAuthStore((state) => state.clearUser);

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: (data) => {
      clearUser();
      queryClient.removeQueries({ queryKey: ["auth"] });
      void queryClient.invalidateQueries({ queryKey: ["music-dashboard"] });

      toast.success(data?.message || "Logged out successfully");
      router.replace("/login");
      router.refresh();
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || "Logout failed. Please try again.");
    },
  });

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    const syncActiveSection = () => {
      setActiveSection(window.location.hash.slice(1) || "music");
    };

    syncActiveSection();
    window.addEventListener("hashchange", syncActiveSection);
    window.addEventListener("popstate", syncActiveSection);

    return () => {
      window.removeEventListener("hashchange", syncActiveSection);
      window.removeEventListener("popstate", syncActiveSection);
    };
  }, [pathname]);

  const handleSectionNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (pathname !== "/" || !href.startsWith("/#")) return;

    const section = document.getElementById(href.slice(2));
    if (!section) return;

    event.preventDefault();
    window.history.pushState(null, "", href);
    setActiveSection(href.slice(2));
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderNavItem = (item: (typeof navItems)[number]) => {
    const sectionId = item.href.startsWith("/#") ? item.href.slice(2) : null;
    const isActive = sectionId
      ? pathname === "/" &&
        (activeSection === sectionId ||
          (activeSection === null && sectionId === "music"))
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={(event) => handleSectionNavigation(event, item.href)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "mx-4 flex h-12 -translate-y-5 items-center justify-center rounded-2xl text-sm font-semibold uppercase tracking-wide transition-colors lg:mx-8",
          isActive
            ? "bg-[#01579B] text-white hover:bg-[#014b87]"
            : "text-slate-400 hover:bg-slate-50 hover:text-[#01579B]",
        )}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-border bg-white text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8 lg:px-14">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            className="shrink-0 text-slate-600 hover:text-[#09bcae]"
          >
            <Menu className="size-5" />
          </Button>

          <form role="search" className="w-full max-w-xs sm:max-w-sm">
            <InputGroup className="h-10 rounded-lg border-slate-200 bg-white shadow-sm">
              <InputGroupAddon className="pl-3 text-slate-500">
                <Search className="size-5" />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                aria-label="Search"
                placeholder="What are you looking for?"
                className="text-sm placeholder:text-slate-400 sm:text-base"
              />
            </InputGroup>
          </form>
        </div>

        <Link
          href="/"
          className="text-base font-bold text-[#09bcae] md:hidden"
        >
          LOGO
        </Link>

        {authStatus === "idle" || authStatus === "loading" ? (
          <div
            className="ml-auto size-10 animate-pulse rounded-full bg-slate-200"
            aria-label="Loading account"
          />
        ) : currentUser ? (
          <div className="flex flex-1 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Open account menu"
                    className="cursor-pointer rounded-full outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-[#09bcae]"
                  >
                    <Avatar>
                      {currentUser.avatarUrl ? (
                        <AvatarImage
                          src={currentUser.avatarUrl}
                          alt={currentUser.displayName}
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      <AvatarFallback>
                        {getInitials(currentUser.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-48 p-1.5"
              >
                <DropdownMenuItem
                  onClick={() => router.push("/setting?tab=account")}
                  className="cursor-pointer gap-2 px-3 py-2"
                >
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={logoutMutation.isPending}
                  onClick={() => logoutMutation.mutate()}
                  className="cursor-pointer gap-2 px-3 py-2"
                >
                  <LogOut />
                  {logoutMutation.isPending ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Upload content"
              className="hidden text-slate-600 hover:text-[#09bcae] sm:inline-flex"
            >
              <Upload className="size-5" />
            </Button>
            <Link
              href="/login"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#09bcae] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#08a99d] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#09bcae]/30 sm:px-7"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>

      <nav
        aria-label="Primary navigation"
        className="relative hidden h-14 border-t border-slate-100 md:grid md:grid-cols-[1fr_1fr_7rem_1fr_1fr] md:items-center lg:grid-cols-[1fr_1fr_9rem_1fr_1fr]"
      >
        {renderNavItem(navItems[0])}
        {renderNavItem(navItems[1])}

        <div className="flex h-full -translate-y-5 items-center justify-center">
          <Logo />
        </div>

        {renderNavItem(navItems[2])}
        {renderNavItem(navItems[3])}
      </nav>
    </header>
  );
};

export default Header;
