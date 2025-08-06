"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";

import { CoverPageData, FileUpload } from "../../../src/types/story";
import { useGlobalContext } from "../../context/context";
import { storyAPI } from "../../api/story";
import { getFilesToUpload } from "../../utils/story";

import Bar from "../Bar";
import Button from "../Button";
import PageEdit from "../PageEdit";
import Panels from "../Panels";
import style from "./style.module.css";

const INITIAL_COVER_PAGE_STATE: CoverPageData = {
  "0": { grid: { c: 12, r: 10, rs: 0, cs: 0 }, type: "jpg" },
  "1": {
    grid: { c: 12, r: 2, rs: 10, cs: 0 },
    type: "text",
    placeholder: "Phi Le",
    value: "cake",
  },
};

const CreateStory = () => {
  const [coverPageData, setCoverPageData] = useState<CoverPageData>(
    INITIAL_COVER_PAGE_STATE
  );
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
  const { dispatch, state } = useGlobalContext();
  const router = useRouter();

  const storyCreationQuery = useQuery({
    queryKey: ["createStory", state.stellaId],
    queryFn: async () => {
      if (!state.stellaId) throw new Error("User ID required");

      const data = await storyAPI.create(
        state.stellaId,
        INITIAL_COVER_PAGE_STATE
      );

      const storyId = data?.story?.storyId;

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
      router.push(`/profile/${state.stellaId}/${currentStoryId}`);
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

  const handleCoverPageChange = (updatedData: CoverPageData) => {
    setCoverPageData(updatedData);
  };

  const handleSave = async () => {
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
  };

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

      <Panels
        items={coverPageData}
        isEditMode
        className={style.panels}
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

export default CreateStory;
