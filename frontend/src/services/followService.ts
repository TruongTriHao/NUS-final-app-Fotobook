import type { ApiResponse } from "../types/api";
import type { ProfileData } from "../types/User";
import { apiClient } from "./apiClient";

export const followService = {
  getFollowersProfileData: async (
    id: string,
  ): Promise<ApiResponse<{ followers: ProfileData[] }>> => {
    const response = await apiClient.get<
      ApiResponse<{ followers: ProfileData[] }>
    >(`/users/${id}/followers`);
    return response.data;
  },

  getFolloweesProfileData: async (
    id: string,
  ): Promise<ApiResponse<{ followees: ProfileData[] }>> => {
    const response = await apiClient.get<
      ApiResponse<{ followees: ProfileData[] }>
    >(`/users/${id}/following`);
    return response.data;
  },
};
