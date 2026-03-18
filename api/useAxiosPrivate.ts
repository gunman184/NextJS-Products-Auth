"use client";

import { useEffect, useRef } from "react";
import axiosPrivate from "@/lib/axios";
import { useAuthContext } from "@/context/AuthContext";
import AuthService from "@/services/authService";

const useAxiosPrivate = () => {
  const { auth, setAuth, loggingOut } = useAuthContext();
  const refreshPromise = useRef<Promise<string> | null>(null);

  useEffect(() => {
    const reqInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization && auth?.accessToken) {
          config.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const resInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest: any = error.config;

        if (loggingOut.current || originalRequest.url?.includes("/refresh")) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            if (!refreshPromise.current) {
              refreshPromise.current = AuthService.refreshToken()
                .then((newToken) => {
                  setAuth((prev: any) => ({
                    ...prev,
                    accessToken: newToken,
                  }));
                  return newToken;
                })
                .finally(() => {
                  refreshPromise.current = null;
                });
            }

            const newAccessToken = await refreshPromise.current;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axiosPrivate(originalRequest);
          } catch (err) {
            setAuth({ accessToken: null, user: null, roles: [] });
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(reqInterceptor);
      axiosPrivate.interceptors.response.eject(resInterceptor);
    };
  }, [auth?.accessToken, setAuth, loggingOut]);

  return axiosPrivate;
};

export default useAxiosPrivate;
