import axios from "axios";
import { waitForFirebaseToken } from "../hooks/useFirebaseToken";
import { CoverPageData } from "../types/story";

/**
 * Hook that provides story API methods with automatic Firebase token injection
 */
export function useStoryAPI() {
  return {
    getById: async (stellaId: string, storyId: string) => {
      const token = await waitForFirebaseToken();
      return storyAPI.getById(stellaId, storyId, token);
    },
    create: async (
      stellaId: string,
      storyId: string,
      coverPage: CoverPageData
    ) => {
      console.log("get token");
      const token = await waitForFirebaseToken();
      console.log("wait for token");
      return storyAPI.create(stellaId, storyId, coverPage, token);
    },
    update: async (
      stellaId: string,
      storyId: string,
      coverPage: CoverPageData
    ) => {
      const token = await waitForFirebaseToken();
      return storyAPI.update(stellaId, storyId, coverPage, token);
    },
    uploadImage: async (
      stellaId: string,
      storyId: string,
      file: File,
      imageId: string
    ) => {
      const token = await waitForFirebaseToken();

      return storyAPI.uploadImage(stellaId, storyId, file, imageId, token);
    },
    deleteImages: async (storyId: string, imageKeys: string[]) => {
      const token = await waitForFirebaseToken();
      return storyAPI.deleteImages(storyId, imageKeys, token);
    },
    createPage: async (
      stellaId: string,
      storyId: string,
      pageId: string,
      pageData: CoverPageData
    ) => {
      const token = await waitForFirebaseToken();
      return storyAPI.createPage(stellaId, storyId, pageId, pageData, token);
    },
    deletePage: async (stellaId: string, storyId: string, pageId: string) => {
      const token = await waitForFirebaseToken();
      return storyAPI.deletePage(stellaId, storyId, pageId, token);
    },
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_NEXT_PUBLIC_STELLA_APP_HOST;

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
