import axios from "axios";
import {
  createApiHeaders,
  getFirebaseToken,
  sanitizeDataForBackend,
} from "../utils/apiHelpers";

export interface Story {
  storyId: string;
  stellaId: string;
  coverPage: Record<string, any>;
  pages?: Record<string, { panels: Record<string, any> }>;
  createdAt: string;
  updatedAt: string;
}

export interface StoriesResponse {
  stories: Story[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StoryResponse {
  story: Story | null;
}

export interface StoriesParams {
  page?: number;
  limit?: number;
}

export interface CreateStoryRequest {
  title?: string;
  description?: string;
  coverPage?: Record<string, any>;
}

export interface UpdateStoryRequest {
  storyId: string;
  title?: string;
  description?: string;
  coverPage?: Record<string, any>;
  pages?: any[];
}

export interface CreatePageRequest {
  page?: {
    pageType?: string;
    panels?: Record<string, any>;
    order?: number;
  };
  pageType?: string;
  panels?: Record<string, any>;
  order?: number;
}

/**
 * Stories API service for backend requests
 */
export const storiesAPI = {
  /**
   * Fetch all stories
   */
  getAll: async (params: StoriesParams = {}): Promise<StoriesResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());

    const { data } = await axios.get(`/api/stories?${searchParams.toString()}`);
    return data;
  },

  /**
   * Fetch stories by user stellaId
   */
  getByUser: async (
    stellaId: string,
    params: StoriesParams = {}
  ): Promise<StoriesResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());

    const { data } = await axios.get(
      `/api/profiles/${stellaId}/stories?${searchParams.toString()}`
    );
    return data;
  },

  /**
   * Fetch individual story by stellaId and storyId
   */
  getById: async (
    stellaId: string,
    storyId: string
  ): Promise<StoryResponse> => {
    const { data } = await axios.get(
      `/api/profiles/${stellaId}/stories/${storyId}`
    );
    return data;
  },

  /**
   * Create a new story
   */
  create: async (
    stellaId: string,
    storyData: CreateStoryRequest,
    storyId: string
  ): Promise<StoryResponse> => {
    const token = await getFirebaseToken();
    const sanitizedData = sanitizeDataForBackend(storyData);
    const { data } = await axios.post(
      `/api/profiles/${stellaId}/stories/${storyId}`,
      sanitizedData,
      {
        headers: createApiHeaders(token),
      }
    );
    return data;
  },

  /**
   * Update a story
   */
  update: async (
    stellaId: string,
    updateData: UpdateStoryRequest
  ): Promise<StoryResponse> => {
    const token = await getFirebaseToken();
    const { storyId, ...data } = updateData;
    const sanitizedData = sanitizeDataForBackend(data);
    const { data: responseData } = await axios.patch(
      `/api/profiles/${stellaId}/stories/${storyId}`,
      sanitizedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return responseData;
  },

  /**
   * Delete a story
   */
  delete: async (stellaId: string, storyId: string): Promise<any> => {
    const token = await getFirebaseToken();
    const { data } = await axios.delete(
      `/api/profiles/${stellaId}/stories/${storyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  /**
   * Upload story image
   */
  uploadImage: async (
    stellaId: string,
    storyId: string,
    formData: FormData
  ): Promise<any> => {
    const token = await getFirebaseToken();
    const { data } = await axios.post(
      `/api/profiles/${stellaId}/stories/${storyId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  /**
   * Create a new page in a story
   */
  createPage: async (
    stellaId: string,
    storyId: string,
    pageData: CreatePageRequest
  ): Promise<any> => {
    const token = await getFirebaseToken();
    const sanitizedData = sanitizeDataForBackend(pageData);

    const { data } = await axios.post(
      `/api/profiles/${stellaId}/stories/${storyId}/pages`,
      sanitizedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  /**
   * Update a specific page by pageId in a story
   */
  updatePageById: async (
    stellaId: string,
    storyId: string,
    pageId: string,
    updateData: any
  ): Promise<any> => {
    const token = await getFirebaseToken();
    const sanitizedData = sanitizeDataForBackend(updateData);
    const { data } = await axios.patch(
      `/api/profiles/${stellaId}/stories/${storyId}/pages/${pageId}`,
      sanitizedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },

  /**
   * Delete a page from a story
   */
  deletePage: async (
    stellaId: string,
    storyId: string,
    pageId: string
  ): Promise<any> => {
    const token = await getFirebaseToken();
    const { data } = await axios.delete(
      `/api/profiles/${stellaId}/stories/${storyId}/pages/${pageId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  },
};
