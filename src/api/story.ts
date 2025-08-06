import axios from "axios";
import { CoverPageData } from "../types/story";

const API_BASE_URL = process.env.NEXT_PUBLIC_STELLA_APP_HOST;

export const storyAPI = {
  getById: async (storyId: string) => {
    console.log(storyId);
    const { data } = await axios.get(`${API_BASE_URL}/story/${storyId}`);
    return data;
  },

  create: async (stellaId: string, coverPage: CoverPageData) => {
    const { data } = await axios.post(`${API_BASE_URL}/story`, {
      stellaId,
      coverPage,
    });
    return data;
  },

  update: async (storyId: string, coverPage: CoverPageData) => {
    const { data } = await axios.patch(`${API_BASE_URL}/story/${storyId}`, {
      coverPage,
    });
    return data;
  },

  uploadImage: async (storyId: string, file: File, imageId: string) => {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error(
        `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB`
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageKey", imageId);

    const { data } = await axios.post(
      `${API_BASE_URL}/story/${storyId}/upload-image`,
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
      `${API_BASE_URL}/story/${storyId}/delete-images`,
      {
        data: { imageKeys },
      }
    );
    return data;
  },
};
