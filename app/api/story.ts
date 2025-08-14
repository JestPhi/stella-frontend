import axios from "axios";
import { useFirebaseToken } from "../hooks/useFirebaseToken";
import { CoverPageData } from "../types/story";

/**
 * Hook that provides story API methods with automatic Firebase token injection
 */
export function useStoryAPI() {
  const token = useFirebaseToken();

  return {
    getById: (stellaId: string, storyId: string) =>
      storyAPI.getById(stellaId, storyId, token),
    create: (stellaId: string, storyId: string, coverPage: CoverPageData) =>
      storyAPI.create(stellaId, storyId, coverPage, token),
    update: (stellaId: string, storyId: string, coverPage: CoverPageData) =>
      storyAPI.update(stellaId, storyId, coverPage, token),
    uploadImage: (
      stellaId: string,
      storyId: string,
      file: File,
      imageId: string
    ) => storyAPI.uploadImage(stellaId, storyId, file, imageId, token),
    deleteImages: (storyId: string, imageKeys: string[]) =>
      storyAPI.deleteImages(storyId, imageKeys, token),
    createPage: (
      stellaId: string,
      storyId: string,
      pageId: string,
      pageData: CoverPageData
    ) => storyAPI.createPage(stellaId, storyId, pageId, pageData, token),
    deletePage: (stellaId: string, storyId: string, pageId: string) =>
      storyAPI.deletePage(stellaId, storyId, pageId, token),
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_STELLA_APP_HOST;

export const storyAPI = {
  getById: async (stellaId: string, storyId: string, token?: string) => {
    console.log(`${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}`);
    const { data } = await axios.get(
      `${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return data;
  },

  create: async (
    stellaId: string,
    storyId: string,
    coverPage: CoverPageData,
    token?: string
  ) => {
    console.log(storyId);
    const { data } = await axios.post(
      `${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}`,
      { coverPage },
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return data;
  },

  update: async (
    stellaId: string,
    storyId: string,
    coverPage: CoverPageData,
    token?: string
  ) => {
    const { data } = await axios.patch(
      `${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}`,
      { coverPage },
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return data;
  },

  uploadImage: async (
    stellaId: string,
    storyId: string,
    file: File,
    imageId: string,
    token?: string
  ) => {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error(
        `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB`
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageKey", imageId);

    const { data } = await axios.post(
      `${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}/images`,
      formData,
      {
        timeout: 30000,
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      }
    );
    return data;
  },

  deleteImages: async (
    storyId: string,
    imageKeys: string[],
    token?: string
  ) => {
    if (!imageKeys || imageKeys.length === 0) {
      throw new Error("At least one image key is required");
    }
    const { data } = await axios.delete(
      `${API_BASE_URL}/stories/${storyId}/delete-images`,
      {
        data: { imageKeys },
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      }
    );
    return data;
  },

  createPage: async (
    stellaId: string,
    storyId: string,
    pageId: string,
    pageData: CoverPageData,
    token?: string
  ) => {
    const { data } = await axios.post(
      `${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}/pages/${pageId}`,
      {
        id: pageId,
        panels: pageData,
      },
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return data;
  },

  deletePage: async (
    stellaId: string,
    storyId: string,
    pageId: string,
    token?: string
  ) => {
    const { data } = await axios.delete(
      `${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}/pages/${pageId}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return data;
  },
};
