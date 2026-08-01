import axios from "axios";

function getBaseURL(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  }
  const h = window.location.hostname;
  if (h === "localhost" || h === "127.0.0.1") {
    return "http://localhost:8000/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

api.interceptors.request.use((config) => {
  if (config.url && !config.url.endsWith("/") && !config.url.includes("?")) {
    config.url = config.url + "/";
  } else if (config.url && config.url.includes("?") && !config.url.split("?")[0].endsWith("/")) {
    const [path, query] = config.url.split("?");
    config.url = path + "/?" + query;
  }
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
  }
  const method = config.method?.toUpperCase();
  if (method && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

function onRefreshDone(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await axios.post(`${getBaseURL()}/auth/jwt/refresh/`, {}, { withCredentials: true });
          isRefreshing = false;
          onRefreshDone(true);
          return api(originalRequest);
        } catch {
          isRefreshing = false;
          onRefreshDone(false);
          return Promise.reject(error);
        }
      }
      return new Promise((resolve, reject) => {
        refreshSubscribers.push((success) => {
          if (success) resolve(api(originalRequest));
          else reject(error);
        });
      });
    }
    return Promise.reject(error);
  }
);

export default api;
