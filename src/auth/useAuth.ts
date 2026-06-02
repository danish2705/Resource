import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "./rbac";

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
  portfolio: string;
  pillar: string | null;
}

// ─── Credential Store ─────────────────────────────────────────────────────────
const CREDENTIALS: Array<{
  username: string;
  password: string;
  user: AuthUser;
}> = [
  {
    username: "super",
    password: "super",
    user: {
      id: "auth-1",
      username: "super",
      role: "super_admin",
      portfolio: "Global",
      pillar: null,
    },
  },
  {
    username: "pmo",
    password: "pmo",
    user: {
      id: "auth-2",
      username: "pmo",
      role: "pmo",
      portfolio: "Hi-tech",
      pillar: "Hi-tech",
    },
  },
  {
    username: "resm",
    password: "resm",
    user: {
      id: "auth-3",
      username: "resm",
      role: "resource_manager",
      portfolio: "Banking",
      pillar: "Hi-tech",
    },
  },
  {
    username: "reso",
    password: "reso",
    user: {
      id: "auth-4",
      username: "reso",
      role: "resource",
      portfolio: "Healthcare",
      pillar: "Healthcare",
    },
  },
];

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (username, password) => {
        const match = CREDENTIALS.find(
          (c) =>
            c.username.toLowerCase() === username.toLowerCase() &&
            c.password === password,
        );
        if (match) {
          set({ user: match.user, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: "Invalid username or password" };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

// Register this store globally so useStore.ts can access it lazily
// without a direct import (which would create a circular dependency).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__zustand_useAuth = useAuth;
