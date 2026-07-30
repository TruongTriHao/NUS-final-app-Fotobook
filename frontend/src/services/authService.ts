import type { ApiResponse } from "../types/api";
import type { User } from "../types/User";
import { apiClient } from "./apiClient";

export const authService = {
  getMe: async (): Promise<ApiResponse<{ user: User | null }>> => {
    const response =
      await apiClient.get<ApiResponse<{ user: User | null }>>("/auth/me");
    return response.data;
  },

  login: async (
    email: string,
    password: string,
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post<ApiResponse<{ user: User }>>(
      "/auth/login",
      { email, password },
    );
    return response.data;
  },

  register: async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>("/auth/register", {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      `/auth/verify-email`,
      { token },
    );
    return response.data;
  },

  resendVerifyEmail: async (token: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      `/auth/resend-verify-email`,
      { token },
    );
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/auth/forgot-password",
      { email },
    );
    return response.data;
  },

  resetPassword: async (
    token: string,
    password: string,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/auth/reset-password",
      { token, password },
    );
    return response.data;
  },
};
