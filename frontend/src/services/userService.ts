import type { ApiResponse } from "../types/api";
import type { AdminUserData, ProfileData, User } from "../types/User";
import { apiClient } from "./apiClient";

export const userService = {
  followUser: async (
    userId: string,
  ): Promise<ApiResponse<{ follow: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ follow: boolean }>>(
      `/users/${userId}/follow`,
    );
    return response.data;
  },

  getUsers: async (
    page: number,
    limit: number,
  ): Promise<ApiResponse<{ users: AdminUserData[]; total: number }>> => {
    const response = await apiClient.get<
      ApiResponse<{ users: AdminUserData[]; total: number }>
    >("/admin/users", {
      params: { page, limit },
    });
    return response.data;
  },

  getUserById: async (
    id: string,
  ): Promise<ApiResponse<{ user: AdminUserData }>> => {
    const response = await apiClient.get<ApiResponse<{ user: AdminUserData }>>(
      `/admin/users/${id}`,
    );
    return response.data;
  },

  getProfileData: async (
    currentId: string,
    activeId: string,
  ): Promise<ApiResponse<{ user: ProfileData }>> => {
    const response =
      currentId === activeId
        ? await apiClient.get<ApiResponse<{ user: ProfileData }>>("/users/me")
        : await apiClient.get<ApiResponse<{ user: ProfileData }>>(
            `/users/${activeId}`,
          );
    return response.data;
  },

  updateProfile: async (
    formData: FormData,
  ): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.patch<ApiResponse<{ user: User }>>(
      "/users/me",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  updateAdminUser: async (
    userId: string,
    formData: FormData,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch<ApiResponse<null>>(
      `/admin/users/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  deleteUser: async (userId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/admin/users/${userId}`,
    );
    return response.data;
  },

  unfollowUser: async (
    userId: string,
  ): Promise<ApiResponse<{ follow: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ follow: boolean }>>(
      `/users/${userId}/follow`,
    );
    return response.data;
  },
};
