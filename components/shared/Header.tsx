import { Menu, Search, Upload } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Logo from "./Logo";
import { checkAuthen } from "@/utilts/checkAuthen";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "../ui/avatar";

const navItems = [
  { label: "Music", href: "/music" },
  { label: "Videos", href: "/videos" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Voting", href: "/voting" },
];

const Header = () => {
  return (
    <header className="relative z-20 shrink-0 border-b border-border bg-white text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
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
          href="/music"
          className="text-base font-bold text-[#09bcae] md:hidden"
        >
          LOGO
        </Link>

        {checkAuthen() ? (
          <>
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className="grayscale"
              />
            </Avatar>
          </>
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
        <Link
          href={navItems[0].href}
          className="flex h-full -translate-y-5 items-center justify-center text-sm font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:text-[#09bcae]"
        >
          {navItems[0].label}
        </Link>
        <Link
          href={navItems[1].href}
          className="flex h-full -translate-y-5 items-center justify-center text-sm font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:text-[#09bcae]"
        >
          {navItems[1].label}
        </Link>

        <div className="flex h-full -translate-y-5 items-center justify-center">
          <Logo />
        </div>

        <Link
          href={navItems[2].href}
          className="flex h-full -translate-y-5 items-center justify-center text-sm font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:text-[#09bcae]"
        >
          {navItems[2].label}
        </Link>
        <Link
          href={navItems[3].href}
          className="flex h-full -translate-y-5 items-center justify-center text-sm font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:text-[#09bcae]"
        >
          {navItems[3].label}
        </Link>
      </nav>
    </header>
  );
};

export default Header;
