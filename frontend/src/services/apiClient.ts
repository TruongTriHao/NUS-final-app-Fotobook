import axios, { AxiosError, type AxiosResponse } from "axios";
import type { ApiErrorResponse } from "../types/api";

export const apiClient = axios.create({
  baseURL:
    (import.meta.env.VITE_API_BASE_URL as string) ||
    "http://localhost:3000/api",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    let normalizedError: ApiErrorResponse;
    if (error.response) {
      normalizedError = error.response.data as ApiErrorResponse;
      const statusCode = error.response.status || normalizedError.statusCode;
      if (
        statusCode === 401 ||
        (statusCode === 403 &&
          (normalizedError.message.includes("not active") ||
            normalizedError.message.includes("not verified")))
      ) {
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.reload();
        }
      }
      if (import.meta.env.DEV) {
        console.error(
          `[API Error ${normalizedError.statusCode.toString()}]: ${normalizedError.message}`,
        );
        if (normalizedError.stack) console.error(normalizedError.stack);
      }
    } else if (error.request) {
      normalizedError = {
        name: "NetworkError",
        status: "error",
        statusCode: 503,
        message: "Cannot connect to the server. Please check your network.",
        data: null,
      };
    } else {
      normalizedError = {
        name: "UnknownError",
        status: "error",
        statusCode: 500,
        message: error.message || "An unknown error has occurred.",
        data: null,
      };
    }
    return Promise.reject(normalizedError);
  },
);
