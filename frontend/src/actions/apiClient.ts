import axios from "axios";
import { autoLogin } from "./userAction";

const baseURL = import.meta.env.VITE_ADMIN_URL;

const axiosAuth = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // Handle 401/403 errors and try to refresh token once
    const shouldRetry =
      (status === 401 || status === 403) && !originalRequest._retry;

    if (shouldRetry) {
      originalRequest._retry = true;
      try {
        await autoLogin(); // Refresh cookie/token
        return axiosAuth(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }

    // Log and propagate error
    console.error("Error response:", error.response);
    return Promise.reject(error);
  }
);

export default axiosAuth;