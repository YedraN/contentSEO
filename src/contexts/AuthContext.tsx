"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  agencyName: string | null;
  credits: number;
  subscriptionPlan: string | null;
  subscriptionStatus: string | null;
  articlesLimitPerMonth: number;
  articlesUsedThisMonth: number;
  defaultLanguage: string;
  defaultTone: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      } else {
        setUser(null);
        // The token cookie has a valid signature (so middleware keeps
        // redirecting auth pages to /dashboard) but no matching user exists
        // in the DB — e.g. the database was reset. Clear the orphan cookie to
        // break the /login ⇄ /dashboard redirect loop (blank white screen).
        if (res.status === 401) {
          await fetch("/api/auth/logout", { method: "POST" });
        }
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
