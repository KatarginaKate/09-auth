"use client";

import { useEffect } from "react";
import { getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const user = await getMe();
        setUser(user);
      } catch {
        clearIsAuthenticated();
      }
    };

    restoreSession();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
