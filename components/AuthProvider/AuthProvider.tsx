"use client";

import { useEffect } from "react";
import { getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, clearIsAuthenticated, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If user is already in store (from localStorage), don't clear on auth error
    const restoreSession = async () => {
      // Skip if user already exists (from localStorage persistence)
      if (user && isAuthenticated) {
        console.log("User already in store from localStorage:", user.email);
        return;
      }

      try {
        const fetchedUser = await getMe();
        setUser(fetchedUser);
      } catch (error) {
        // Only clear if user wasn't in localStorage
        if (!user) {
          clearIsAuthenticated();
        }
      }
    };

    restoreSession();
  }, [user, isAuthenticated, setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
