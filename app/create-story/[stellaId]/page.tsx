"use client";

import { useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { CoverPageData, FileUpload } from "../../types/story";

import { storyAPI } from "../../api/story";
import { getFilesToUpload } from "../../utils/story";
import Bar from "../../components/Bar";
import Button from "../../components/Button";
import Panels from "../../components/Panels";
import style from "./style.module.css";

const INITIAL_COVER_PAGE_STATE: CoverPageData = {
  "0": { grid: { c: 12, r: 10, rs: 0, cs: 0 }, type: "jpg" },
  "1": {
    grid: { c: 12, r: 2, rs: 10, cs: 0 },
    type: "text",
    placeholder: "Enter a title",
    value: "",
  },
};

const CreateStory = () => {
  const { stellaId } = useParams();

  // Combined save mutation that handles both uploads and updates
  const saveMutation = useMutation({
    mutationFn: async (data: CoverPageData) => {
      const currentStoryId = `story_${uuidv4()}`;
      const filesToUpload = getFilesToUpload(data);
      const updatedData = { ...data };

      // Upload files if any
      for (const fileUpload of filesToUpload) {
        const result = await storyAPI.uploadImage(
          stellaId,
          currentStoryId,
          fileUpload.file,
          fileUpload.imageId
        );

        const imageKey = result.key || result.url || fileUpload.imageId;
        updatedData[fileUpload.elementKey] = {
          ...updatedData[fileUpload.elementKey],
          value: imageKey,
          imageKey,
        };
      }

      // Update story
      const response = await storyAPI.create(
        stellaId,
        currentStoryId,
        updatedData
      );
      return response;
    },
    onSuccess: (response) => {
      console.log("HI PHI");
      // Navigate or send message to parent
      parent.postMessage(
        {
          type: "SET_LAYOUT",
          payload: {
            basePathname: `/profile/${stellaId}/story/${response.story.storyId}`,
            modalVisible: false,
          },
        },
        `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
      );
    },
  });

  const dataRef = useRef(null);

  // Handlers
  const handleCoverPageChange = (updatedData: Record<string, any>) => {
    dataRef.current = updatedData;
  };

  const handleSave = () => {
    saveMutation.mutate(dataRef.current);
  };

  // Get status for UI
  const isLoading = saveMutation.isPending;
  const buttonText = isLoading ? "Saving..." : "Add Story";
  const hasError = saveMutation.isError;

  return (
    <div className={style.addStoryWrapper}>
      {hasError && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          Failed to save story. Please try again.
        </div>
      )}
      <Panels
        items={INITIAL_COVER_PAGE_STATE}
        isEditMode
        className={style.panels}
        onChange={handleCoverPageChange}
      />
      <Bar className={style.bar} variant="default">
        <Button
          className={style.addStory}
          variant="primary"
          onClick={handleSave}
        >
          {buttonText}
        </Button>
      </Bar>
    </div>
  );
};

export default CreateStory;
