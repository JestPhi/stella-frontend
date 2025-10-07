import { useCallback, useState } from "react";
import {
  usePageCreate,
  usePageUpdateById,
  useStoryCreate,
  useStoryImageUpload,
  useStoryUpdate,
} from "../hooks/useStoryMutations";
import { CoverPageData } from "../types/story";
import { getFilesToUpload } from "../utils/story";

type UsePageEditorProps = {
  stellaId: string;
  storyId?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
};

export const usePageEditor = ({
  stellaId,
  storyId,
  onSuccess,
  onError,
}: UsePageEditorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storyCreate = useStoryCreate();
  const storyUpdate = useStoryUpdate();
  const pageCreate = usePageCreate();
  const pageUpdateById = usePageUpdateById();
  const storyImageUpload = useStoryImageUpload();

  const uploadFiles = useCallback(
    async (data: CoverPageData, targetStoryId: string) => {
      const filesToUpload = getFilesToUpload(data);
      const updatedData = { ...data };

      for (const fileUpload of filesToUpload) {
        const formData = new FormData();
        formData.append("file", fileUpload.file);
        formData.append("imageKey", fileUpload.imageKey);

        const result = await new Promise<any>((resolve, reject) => {
          storyImageUpload.mutate(
            { stellaId, storyId: targetStoryId, formData },
            { onSuccess: resolve, onError: reject }
          );
        });

        const imageKey = result.key || result.url || fileUpload.imageKey;
        updatedData[fileUpload.elementKey] = {
          ...updatedData[fileUpload.elementKey],
          value: imageKey,
        };
      }

      return updatedData;
    },
    [stellaId, storyImageUpload]
  );

  const createStory = useCallback(
    async (data: CoverPageData, newStoryId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const updatedData = await uploadFiles(data, newStoryId);

        await new Promise<void>((resolve, reject) => {
          storyCreate.mutate(
            {
              stellaId,
              storyData: { coverPage: updatedData },
              storyId: newStoryId,
            },
            {
              onSuccess: () => {
                onSuccess?.();
                resolve();
              },
              onError: (err) => {
                onError?.(err);
                reject(err);
              },
            }
          );
        });
      } catch (err: any) {
        setError(err.message || "Failed to create story");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [stellaId, storyCreate, uploadFiles, onSuccess, onError]
  );

  const updateCoverPage = useCallback(
    async (data: CoverPageData) => {
      if (!storyId) throw new Error("Story ID is required");

      try {
        setIsLoading(true);
        setError(null);

        const updatedData = await uploadFiles(data, storyId);

        await new Promise<void>((resolve, reject) => {
          storyUpdate.mutate(
            {
              stellaId,
              storyId,
              updateData: { coverPage: updatedData },
            },
            {
              onSuccess: () => {
                onSuccess?.();
                resolve();
              },
              onError: (err) => {
                onError?.(err);
                reject(err);
              },
            }
          );
        });
      } catch (err: any) {
        setError(err.message || "Failed to update cover page");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [stellaId, storyId, storyUpdate, uploadFiles, onSuccess, onError]
  );

  const updatePage = useCallback(
    async (data: CoverPageData, pageId: string) => {
      if (!storyId) throw new Error("Story ID is required");

      try {
        setIsLoading(true);
        setError(null);

        const updatedData = await uploadFiles(data, storyId);

        await new Promise<void>((resolve, reject) => {
          pageUpdateById.mutate(
            {
              stellaId,
              storyId,
              pageId,
              updateData: { panels: updatedData },
            },
            {
              onSuccess: () => {
                onSuccess?.();
                resolve();
              },
              onError: (err) => {
                onError?.(err);
                reject(err);
              },
            }
          );
        });
      } catch (err: any) {
        setError(err.message || "Failed to update page");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [stellaId, storyId, pageUpdateById, uploadFiles, onSuccess, onError]
  );

  const createPage = useCallback(
    async (data: CoverPageData, pageData: any) => {
      if (!storyId) throw new Error("Story ID is required");

      try {
        setIsLoading(true);
        setError(null);

        const updatedData = await uploadFiles(data, storyId);

        await new Promise<void>((resolve, reject) => {
          pageCreate.mutate(
            {
              stellaId,
              storyId,
              pageData: {
                ...pageData,
                panels: updatedData,
              },
            },
            {
              onSuccess: () => {
                onSuccess?.();
                resolve();
              },
              onError: (err) => {
                onError?.(err);
                reject(err);
              },
            }
          );
        });
      } catch (err: any) {
        setError(err.message || "Failed to create page");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [stellaId, storyId, pageCreate, uploadFiles, onSuccess, onError]
  );

  return {
    createStory,
    updateCoverPage,
    updatePage,
    createPage,
    isLoading:
      isLoading ||
      storyCreate.isPending ||
      storyUpdate.isPending ||
      pageCreate.isPending ||
      pageUpdateById.isPending ||
      storyImageUpload.isPending,
    error:
      error ||
      (storyCreate.isError ? "Failed to create story" : null) ||
      (storyUpdate.isError ? "Failed to update story" : null) ||
      (pageCreate.isError ? "Failed to create page" : null) ||
      (pageUpdateById.isError ? "Failed to update page" : null) ||
      (storyImageUpload.isError ? "Failed to upload image" : null),
  };
};
