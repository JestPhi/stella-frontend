import {
  CreatePageRequest,
  CreateStoryRequest,
  storiesAPI,
  UpdateStoryRequest,
} from "../api/stories";
import { createMutation, createQueryKeys } from "./useMutationFactory";

/**
 * Story mutation hooks for React Query
 */

export const useStoryCreate = createMutation({
  mutationFn: ({
    stellaId,
    storyData,
    storyId,
  }: {
    stellaId: string;
    storyData: CreateStoryRequest;
    storyId: string;
  }) => storiesAPI.create(stellaId, storyData, storyId),
  invalidateQueries: (variables) => [
    createQueryKeys.story(variables.stellaId).all,
    createQueryKeys.story(variables.stellaId).byUser,
  ],
  errorMessage: "creating story",
});

export const useStoryUpdate = createMutation({
  mutationFn: ({
    stellaId,
    storyId,
    updateData,
  }: {
    stellaId: string;
    storyId: string;
    updateData: Omit<UpdateStoryRequest, "storyId">;
  }) => storiesAPI.update(stellaId, { ...updateData, storyId }),
  invalidateQueries: (variables) => {
    const keys = createQueryKeys.story(variables.stellaId, variables.storyId);
    return [keys.all, keys.byUser, keys.detail!];
  },
  errorMessage: "updating story",
});

export const useStoryDelete = createMutation({
  mutationFn: ({ stellaId, storyId }: { stellaId: string; storyId: string }) =>
    storiesAPI.delete(stellaId, storyId),
  invalidateQueries: (variables) => [
    createQueryKeys.story(variables.stellaId).all,
    createQueryKeys.story(variables.stellaId).byUser,
  ],
  removeQueries: (variables) => [
    createQueryKeys.story(variables.stellaId, variables.storyId).detail!,
  ],
  errorMessage: "deleting story",
});

export const useStoryImageUpload = createMutation({
  mutationFn: ({
    stellaId,
    storyId,
    formData,
  }: {
    stellaId: string;
    storyId: string;
    formData: FormData;
  }) => storiesAPI.uploadImage(stellaId, storyId, formData),
  invalidateQueries: (variables) => [
    createQueryKeys.story(variables.stellaId, variables.storyId).detail!,
  ],
  errorMessage: "uploading story image",
});

export const usePageCreate = createMutation({
  mutationFn: ({
    stellaId,
    storyId,
    pageData,
  }: {
    stellaId: string;
    storyId: string;
    pageData: CreatePageRequest;
  }) => storiesAPI.createPage(stellaId, storyId, pageData),
  invalidateQueries: (variables) => [
    createQueryKeys.story(variables.stellaId, variables.storyId).detail!,
  ],
  errorMessage: "creating page",
});

export const usePageUpdateById = createMutation({
  mutationFn: ({
    stellaId,
    storyId,
    pageId,
    updateData,
  }: {
    stellaId: string;
    storyId: string;
    pageId: string;
    updateData: any;
  }) => storiesAPI.updatePageById(stellaId, storyId, pageId, updateData),
  invalidateQueries: (variables) => [
    createQueryKeys.story(variables.stellaId, variables.storyId).detail!,
  ],
  errorMessage: "updating page by ID",
});

export const usePageDelete = createMutation({
  mutationFn: ({
    stellaId,
    storyId,
    pageId,
  }: {
    stellaId: string;
    storyId: string;
    pageId: string;
  }) => storiesAPI.deletePage(stellaId, storyId, pageId),
  invalidateQueries: (variables) => [
    createQueryKeys.story(variables.stellaId, variables.storyId).detail!,
  ],
  errorMessage: "deleting page",
});
