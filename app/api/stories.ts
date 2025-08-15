import axios from "axios";

export interface Story {
  storyId: string;
  stellaId: string;
  coverPage: Record<string, any>;
  pages?: any[];
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
  pageType?: string;
  content?: Record<string, any>;
  order?: number;
}

export interface UpdatePageRequest {
  pageId: string;
  pageType?: string;
  content?: Record<string, any>;
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
      `/api/stories/${stellaId}?${searchParams.toString()}`
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
    const { data } = await axios.get(`/api/stories/${stellaId}/${storyId}`);
    return data;
  },

  /**
   * Create a new story
   */
  create: async (
    stellaId: string,
    storyData: CreateStoryRequest
  ): Promise<StoryResponse> => {
    const { data } = await axios.post(
      `/api/stories/${stellaId}/story`,
      storyData
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
    const { data } = await axios.patch(
      `/api/stories/${stellaId}/story`,
      updateData
    );
    return data;
  },

  /**
   * Delete a story
   */
  delete: async (stellaId: string, storyId: string): Promise<any> => {
    const { data } = await axios.delete(
      `/api/stories/${stellaId}/${storyId}/delete`
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
    const { data } = await axios.post(
      `/api/stories/${stellaId}/${storyId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
    const { data } = await axios.post(
      `/api/stories/${stellaId}/${storyId}/pages`,
      pageData
    );
    return data;
  },

  /**
   * Update a page in a story
   */
  updatePage: async (
    stellaId: string,
    storyId: string,
    updateData: UpdatePageRequest
  ): Promise<any> => {
    const { data } = await axios.patch(
      `/api/stories/${stellaId}/${storyId}/pages`,
      updateData
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
    const { data } = await axios.delete(
      `/api/stories/${stellaId}/${storyId}/pages?pageId=${pageId}`
    );
    return data;
  },
};
