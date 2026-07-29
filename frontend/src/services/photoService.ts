import type { ApiResponse } from "../types/api";
import type { Photo, PhotoWithOwner } from "../types/Photo";
import { apiClient } from "./apiClient";

export const photoService = {
  createPhoto: async (formData: FormData): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/photos",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  updatePhoto: async (
    id: string,
    formData: FormData,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch<ApiResponse<null>>(
      `/photos/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  getPhotos: async (
    page: number,
    limit: number,
  ): Promise<ApiResponse<{ photos: Photo[]; total: number }>> => {
    const response = await apiClient.get<
      ApiResponse<{ photos: Photo[]; total: number }>
    >("/admin/photos", {
      params: { page, limit },
    });
    return response.data;
  },

  getPhotosForMain: async (
    type: "feed" | "discover",
    cursor: string | null,
    limit: number = 20,
  ): Promise<
    ApiResponse<{ photos: PhotoWithOwner[]; nextCursor: string | null }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{ photos: PhotoWithOwner[]; nextCursor: string | null }>
    >(`/main/${type}/photos`, {
      params: { cursor, limit },
    });
    return response.data;
  },

  likePhoto: async (id: string): Promise<ApiResponse<{ like: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ like: boolean }>>(
      `/photos/${id}/like`,
    );
    return response.data;
  },

  unlikePhoto: async (id: string): Promise<ApiResponse<{ like: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ like: boolean }>>(
      `/photos/${id}/like`,
    );
    return response.data;
  },

  getPhotosByUserId: async (
    userId: string,
  ): Promise<ApiResponse<{ photos: Photo[] }>> => {
    const response = await apiClient.get<ApiResponse<{ photos: Photo[] }>>(
      `/users/${userId}/photos`,
      {
        params: { id: userId },
      },
    );
    return response.data;
  },
  getPhotoById: async (
    id: string,
  ): Promise<ApiResponse<{ content: Photo }>> => {
    const response = await apiClient.get<ApiResponse<{ content: Photo }>>(
      `/photos/${id}`,
    );
    return response.data;
  },

  deletePhoto: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/photos/${id}`);
    return response.data;
  },
};
