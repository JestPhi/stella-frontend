import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import Bar from "../Bar";
import Button from "../Button";
import PageEdit from "../PageEdit";

interface CoverPageElement {
  grid: { c: number; r: number; rs: number; cs: number };
  type: string;
  placeholder?: string;
  value?: string | File;
  imageKey?: string;
}

interface CoverPageData {
  [key: string]: CoverPageElement;
}

interface FileUpload {
  file: File;
  imageId: string;
  elementKey: string;
}

const INITIAL_COVER_PAGE_STATE: CoverPageData = {
  "0": { grid: { c: 12, r: 10, rs: 0, cs: 0 }, type: "jpg" },
  "1": {
    grid: { c: 12, r: 2, rs: 10, cs: 0 },
    type: "text",
    placeholder: "Phi Le",
    value: "cake",
  },
};

const API_BASE_URL = import.meta.env.VITE_STELLA_APP_HOST;

const storyAPI = {
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
};

const extractStoryId = (data: any): string => {
  return data.story?.storyId || data.storyId || data.id;
};

const getFilesToUpload = (coverPageData: CoverPageData): FileUpload[] =>
  Object.entries(coverPageData)
    .filter(
      ([, element]) => element.type === "jpg" && element.value instanceof File
    )
    .map(([key, element]) => ({
      file: element.value as File,
      imageId: uuidv4(),
      elementKey: key,
    }));

const MenuAddStory = () => {
  const [coverPageData, setCoverPageData] = useState<CoverPageData>(
    INITIAL_COVER_PAGE_STATE
  );
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
  const { dispatch, state } = useGlobalContext();
  const navigate = useNavigate();

  const storyCreationQuery = useQuery({
    queryKey: ["createStory", state.stellaId],
    queryFn: async () => {
      if (!state.stellaId) throw new Error("User ID required");

      const data = await storyAPI.create(
        state.stellaId,
        INITIAL_COVER_PAGE_STATE
      );
      const storyId = extractStoryId(data);

      if (!storyId) throw new Error("No story ID returned");

      setCurrentStoryId(storyId);
      return { storyId, data };
    },
    enabled: !!state.stellaId,
    retry: 3,
  });

  const coverPageUpdateMutation = useMutation({
    mutationFn: async (coverPageData: CoverPageData) => {
      if (!currentStoryId) throw new Error("Story ID required");
      return storyAPI.update(currentStoryId, coverPageData);
    },
    onSuccess: () => {
      dispatch({ type: "SET_MENU", payload: null });
      navigate(`/profile/${state.stellaId}/${currentStoryId}`);
    },
  });

  const imageUploadMutation = useMutation({
    mutationFn: async (fileUpload: FileUpload) => {
      if (!currentStoryId) throw new Error("Story ID required");
      return storyAPI.uploadImage(
        currentStoryId,
        fileUpload.file,
        fileUpload.imageId
      );
    },
  });

  const handleCoverPageChange = useCallback((updatedData: CoverPageData) => {
    setCoverPageData(updatedData);
  }, []);

  const handleSave = useCallback(async () => {
    if (!currentStoryId || imageUploadMutation.isPending) return;

    const filesToUpload = getFilesToUpload(coverPageData);
    const updatedData = { ...coverPageData };

    for (const fileUpload of filesToUpload) {
      try {
        const result = await imageUploadMutation.mutateAsync(fileUpload);
        const imageKey = result.key || result.url || fileUpload.imageId;

        updatedData[fileUpload.elementKey] = {
          ...updatedData[fileUpload.elementKey],
          value: imageKey,
          imageKey,
        };
      } catch (error) {
        console.error("Upload failed:", error);
        return;
      }
    }

    setCoverPageData(updatedData);
    coverPageUpdateMutation.mutate(updatedData);
  }, [
    currentStoryId,
    coverPageData,
    imageUploadMutation,
    coverPageUpdateMutation,
  ]);

  const isLoading =
    imageUploadMutation.isPending || coverPageUpdateMutation.isPending;
  const buttonText = imageUploadMutation.isPending
    ? "Uploading..."
    : coverPageUpdateMutation.isPending
    ? "Saving..."
    : "Add Story";
  const hasError =
    coverPageUpdateMutation.isError || imageUploadMutation.isError;

  if (storyCreationQuery.isLoading) {
    return (
      <div className={style.addStoryWrapper}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Creating story...
        </div>
      </div>
    );
  }

  if (storyCreationQuery.isError) {
    return (
      <div className={style.addStoryWrapper}>
        <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
          Failed to create story. Please try again.
        </div>
        <Bar className={style.bar} variant="default">
          <Button
            className={style.addStory}
            variant="primary"
            onClick={() => storyCreationQuery.refetch()}
          >
            Retry
          </Button>
        </Bar>
      </div>
    );
  }

  return (
    <div className={style.addStoryWrapper}>
      {hasError && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          {coverPageUpdateMutation.isError && "Failed to update story. "}
          {imageUploadMutation.isError && "Failed to upload image. "}
          Please try again.
        </div>
      )}

      <PageEdit
        items={coverPageData}
        isEditMode
        onChange={handleCoverPageChange}
      />

      <Bar className={style.bar} variant="default">
        <Button
          className={style.addStory}
          variant="primary"
          onClick={handleSave}
          disabled={!currentStoryId || isLoading}
        >
          {buttonText}
        </Button>
      </Bar>
    </div>
  );
};

export default MenuAddStory;
