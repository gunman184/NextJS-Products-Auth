"use client";

import { useEffect, useState, ReactNode } from "react";
import { useAuthContext } from "@/context/AuthContext";
import AuthService from "@/services/authService";
import useAxiosPrivate from "@/api/useAxiosPrivate";

type PersistLoginProps = {
  children: ReactNode;
};

export default function PersistLogin({ children }: PersistLoginProps) {
  const { auth, setAuth, isAuthReady } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Only refresh if no access token exists in memory
        if (!auth?.accessToken) {
          // The refresh token cookie is automatically sent by the browser
          const newAccessToken = await AuthService.refreshToken();

          // Fetch user info using the new access token
          const user = await AuthService.getMe(axiosPrivate, newAccessToken);

          // Update global auth context
          setAuth({
            accessToken: newAccessToken,
            user,
            roles: user.roles || [],
          });
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
        setAuth({ accessToken: null, user: null, roles: [] });
      } finally {
        setLoading(false);
      }
    };

    // Attempt restore once auth context is ready
    if (isAuthReady) {
      restoreSession();
    }
  }, [isAuthReady, auth?.accessToken, axiosPrivate, setAuth]);

  if (!isAuthReady || loading) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
