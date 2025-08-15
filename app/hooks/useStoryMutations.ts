import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreatePageRequest,
  CreateStoryRequest,
  storiesAPI,
  UpdatePageRequest,
  UpdateStoryRequest,
} from "../api/stories";

/**
 * Story mutation hooks for React Query
 */

export const useStoryCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stellaId,
      storyData,
    }: {
      stellaId: string;
      storyData: CreateStoryRequest;
    }) => storiesAPI.create(stellaId, storyData),
    onSuccess: (data, variables) => {
      // Invalidate stories queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({
        queryKey: ["userStories", variables.stellaId],
      });
    },
  });
};

export const useStoryUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stellaId,
      updateData,
    }: {
      stellaId: string;
      updateData: UpdateStoryRequest;
    }) => storiesAPI.update(stellaId, updateData),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({
        queryKey: ["userStories", variables.stellaId],
      });
      queryClient.invalidateQueries({
        queryKey: ["story", variables.stellaId, variables.updateData.storyId],
      });
    },
  });
};

export const useStoryDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stellaId,
      storyId,
    }: {
      stellaId: string;
      storyId: string;
    }) => storiesAPI.delete(stellaId, storyId),
    onSuccess: (data, variables) => {
      // Invalidate stories queries and remove the specific story from cache
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({
        queryKey: ["userStories", variables.stellaId],
      });
      queryClient.removeQueries({
        queryKey: ["story", variables.stellaId, variables.storyId],
      });
    },
  });
};

export const useStoryImageUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stellaId,
      storyId,
      formData,
    }: {
      stellaId: string;
      storyId: string;
      formData: FormData;
    }) => storiesAPI.uploadImage(stellaId, storyId, formData),
    onSuccess: (data, variables) => {
      // Invalidate story query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["story", variables.stellaId, variables.storyId],
      });
    },
  });
};

export const usePageCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stellaId,
      storyId,
      pageData,
    }: {
      stellaId: string;
      storyId: string;
      pageData: CreatePageRequest;
    }) => storiesAPI.createPage(stellaId, storyId, pageData),
    onSuccess: (data, variables) => {
      // Invalidate story query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["story", variables.stellaId, variables.storyId],
      });
    },
  });
};

export const usePageUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stellaId,
      storyId,
      updateData,
    }: {
      stellaId: string;
      storyId: string;
      updateData: UpdatePageRequest;
    }) => storiesAPI.updatePage(stellaId, storyId, updateData),
    onSuccess: (data, variables) => {
      // Invalidate story query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["story", variables.stellaId, variables.storyId],
      });
    },
  });
};

export const usePageDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      stellaId,
      storyId,
      pageId,
    }: {
      stellaId: string;
      storyId: string;
      pageId: string;
    }) => storiesAPI.deletePage(stellaId, storyId, pageId),
    onSuccess: (data, variables) => {
      // Invalidate story query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["story", variables.stellaId, variables.storyId],
      });
    },
  });
};
