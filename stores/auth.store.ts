import { authService } from "@/services/auth.service";
import { create } from "zustand";

export type UserRole = "USER" | "ADMIN";

/** The artist profile this account manages, or null if it has not claimed one. */
export interface OwnedArtist {
  id: string;
  slug: string;
  name: string;
  isVerified: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  provider?: string | null;
  role: UserRole;
  artist: OwnedArtist | null;
  hasPassword: boolean;
}

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthStore {
  user: AuthUser | null;
  status: AuthStatus;
  fetchMe: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  status: "idle",

  fetchMe: async () => {
    if (get().status !== "idle") return;

    set({ status: "loading" });

    try {
      const data = await authService.me();
      set({ user: data.user, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },

  setUser: (user) => set({ user, status: "authenticated" }),
  clearUser: () => set({ user: null, status: "unauthenticated" }),
}));
