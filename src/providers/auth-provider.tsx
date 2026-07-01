"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  clearStoredAuthSession,
  fetchCurrentUser,
  getStoredAuthToken,
  getStoredAuthUser,
  login,
  logout,
  register,
  type AuthUser,
} from "@/lib/api";

type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredAuthUser());
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const nextUser = await fetchCurrentUser();
    setUser(nextUser);
    return nextUser;
  };

  useEffect(() => {
    let active = true;

    async function hydrate() {
      if (!getStoredAuthToken()) {
        clearStoredAuthSession();
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      const nextUser = await fetchCurrentUser();
      if (active) {
        setUser(nextUser);
        setLoading(false);
      }
    }

    hydrate();

    const sync = () => setUser(getStoredAuthUser());
    window.addEventListener("storage", sync);
    window.addEventListener("hackradar-auth-updated", sync);

    return () => {
      active = false;
      window.removeEventListener("storage", sync);
      window.removeEventListener("hackradar-auth-updated", sync);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      loading,
      user,
      refreshUser,
      signIn: async (payload) => {
        const data = await login(payload);
        setUser(data.user);
      },
      signUp: async (payload) => {
        const data = await register(payload);
        setUser(data.user);
      },
      signOut: async () => {
        await logout();
        setUser(null);
      },
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
