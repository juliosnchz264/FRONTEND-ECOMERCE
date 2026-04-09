// frontend/src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// ============================================
// REQUEST INTERCEPTOR — Attach Bearer token
// ============================================
api.interceptors.request.use(
  (config) => {
    // Dynamically import to avoid circular dependency
    const token = window.__accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR — Handle 401 refresh, 429 rate limit, silent check-session
// ============================================
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || '';

    // --- 429: Rate limit hit ---
    if (status === 429) {
      const retryAfter = error.response?.headers?.['retry-after'];
      const message = error.response?.data?.message || 'Demasiados intentos';

      if (retryAfter) {
        const minutes = Math.ceil(parseInt(retryAfter, 10) / 60);
        toast.error(`${message}. Intenta de nuevo en ${minutes} min.`, { duration: 5000 });
      } else {
        toast.error(`${message}. Espera un momento antes de reintentar.`, { duration: 5000 });
      }

      return Promise.reject(error);
    }

    // --- 401 on check-session: silently resolve as unauthenticated ---
    const isAuthCheck = requestUrl.includes('/auth/check-session');
    if (isAuthCheck && status === 401) {
      return Promise.resolve({
        data: { user: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: originalRequest
      });
    }

    // --- 401 on other requests: attempt token refresh ---
    if (status === 401 && !originalRequest._retry) {
      // Don't retry auth endpoints (login, register, logout, refresh itself)
      const isAuthEndpoint = /\/auth\/(login|register|logout|refresh)/.test(requestUrl);
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((newToken) => {
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data?.accessToken;
        if (newToken) {
          window.__accessToken = newToken;
          // Dispatch event so authServices stays in sync
          window.dispatchEvent(
            new CustomEvent('token-changed', {
              detail: { token: newToken, timestamp: Date.now() },
            })
          );
        }

        isRefreshing = false;
        onRefreshed(newToken);

        // Retry the original request
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];

        // Refresh failed — clear auth state
        window.__accessToken = null;
        window.dispatchEvent(
          new CustomEvent('token-changed', {
            detail: { token: null, timestamp: Date.now() },
          })
        );

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
