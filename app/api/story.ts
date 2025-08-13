import axios from "axios";
import { CoverPageData } from "../types/story";

const API_BASE_URL = process.env.NEXT_PUBLIC_STELLA_APP_HOST;

export const storyAPI = {
  getById: async (stellaId: string, storyId: string) => {
    console.log(`${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}`);
    const { data } = await axios.get(
      `${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}`
    );
    return data;
  },

  create: async (
    stellaId: string,
    storyId: string,
    coverPage: CoverPageData
  ) => {
    console.log(storyId);
    const { data } = await axios.post(
      `${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}`,
      {
        coverPage,
      }
    );
    return data;
  },

  update: async (
    stellaId: string,
    storyId: string,
    coverPage: CoverPageData
  ) => {
    const { data } = await axios.patch(
      `${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}`,
      {
        coverPage,
      }
    );
    return data;
  },

  uploadImage: async (
    stellaId: string,
    storyId: string,
    file: File,
    imageId: string
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
      `${API_BASE_URL}/profiles/${stellaId}/stories/${storyId}/upload-image`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      }
    );
    return data;
  },

  deleteImages: async (storyId: string, imageKeys: string[]) => {
    if (!imageKeys || imageKeys.length === 0) {
      throw new Error("At least one image key is required");
    }
    const { data } = await axios.delete(
      `${API_BASE_URL}/stories/${storyId}/delete-images`,
      {
        data: { imageKeys },
      }
    );
    return data;
  },
};
