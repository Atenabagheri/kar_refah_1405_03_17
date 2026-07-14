import api from "./axios";
import type { Store } from "@reduxjs/toolkit";
import { logout, setAccessToken } from "../src/redux/slices/auth/AuthSlice";

type FailedRequest = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};
export function attachInterceptors(store: Store) {
  let isRefreshing = false;
  let failedQueue: FailedRequest[] = [];

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error);
      else prom.resolve(token);
    });
    failedQueue = [];
  };

  // ---- REQUEST ----
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // ---- RESPONSE ----
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      const excludedUrls = [
        "/api/auth/signing",
        "/api/auth/register",
        "/api/auth/access",
      ];



      if (
        originalRequest?.url &&
        excludedUrls.some((url) => originalRequest.url.includes(url))
      ) {
        return Promise.reject(error);
      }

      // فقط در صورت 401 (Unauthorized) اقدام به رفرش کن
      if (!error.response || error.response.status !== 401) {
        return Promise.reject(error);
      }

      // اگر خود access رفرش شده fail شد → logout
      if (originalRequest.url?.includes("/api/auth/access")) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      // اگر یکبار retry شده → دیگه retry نکن
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // اگر همزمان رفرش می‌شود → فقط صبر کن
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const res = await api.post("/api/auth/access", null, {
          withCredentials: true,
        });

        const newToken = res.data.ac_token;
        store.dispatch(setAccessToken(newToken));

        processQueue(null, newToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        // رفرش توکن هم failed شد → logout کامل
        processQueue(err, null);
        isRefreshing = false;

        store.dispatch(logout());
        return Promise.reject(err);
      }
    }
  );
}
