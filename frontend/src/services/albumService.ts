import type { Album, AlbumWithOwner } from "../types/Album";
import type { ApiResponse } from "../types/api";
import { apiClient } from "./apiClient";

export const albumService = {
  createAlbum: async (formData: FormData): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      "/albums",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  getAlbumsForMain: async (
    type: "feed" | "discover",
    cursor: string | null,
    limit: number = 20,
  ): Promise<
    ApiResponse<{ albums: AlbumWithOwner[]; nextCursor: string | null }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{ albums: AlbumWithOwner[]; nextCursor: string | null }>
    >(`/main/${type}/albums`, {
      params: { cursor, limit },
    });
    return response.data;
  },

  updateAlbum: async (
    id: string,
    formData: FormData,
  ): Promise<ApiResponse<null>> => {
    const response = await apiClient.patch<ApiResponse<null>>(
      `/albums/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  likeAlbum: async (id: string): Promise<ApiResponse<{ like: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ like: boolean }>>(
      `/albums/${id}/like`,
    );
    return response.data;
  },

  unlikeAlbum: async (id: string): Promise<ApiResponse<{ like: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ like: boolean }>>(
      `/albums/${id}/like`,
    );
    return response.data;
  },

  getAlbums: async (
    page: number,
    limit: number,
  ): Promise<ApiResponse<{ albums: Album[]; total: number }>> => {
    const response = await apiClient.get<
      ApiResponse<{ albums: Album[]; total: number }>
    >("/admin/albums", {
      params: { page, limit },
    });
    return response.data;
  },

  getAlbumsByUserId: async (
    userId: string,
  ): Promise<ApiResponse<{ albums: Album[] }>> => {
    const response = await apiClient.get<ApiResponse<{ albums: Album[] }>>(
      `/users/${userId}/albums`,
      {
        params: { id: userId },
      },
    );
    return response.data;
  },

  getAlbumById: async (
    id: string,
  ): Promise<ApiResponse<{ content: Album }>> => {
    const response = await apiClient.get<ApiResponse<{ content: Album }>>(
      `/albums/${id}`,
    );
    return response.data;
  },

  deleteAlbum: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/albums/${id}`);
    return response.data;
  },
};
