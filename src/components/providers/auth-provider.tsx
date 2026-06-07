"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  authApi,
  clearToken,
  isAuthenticated,
  type AuthUser,
} from "@/lib/auth";

const AUTH_CHANGE_EVENT = "share3a-auth-change";

export function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.me();
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      clearToken();
    } finally {
      setUser(null);
      notifyAuthChange();
    }
  }, []);

  useEffect(() => {
    refreshUser();

    function handleAuthChange() {
      refreshUser();
    }

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoggedIn: !!user,
      refreshUser,
      logout,
    }),
    [user, loading, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
