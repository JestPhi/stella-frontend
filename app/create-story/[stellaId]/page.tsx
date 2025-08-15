"use client";

import { useParams } from "next/navigation";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { CoverPageData } from "../../types/story";

import Bar from "../../components/Bar";
import Button from "../../components/Button";
import Panels from "../../components/Panels";
import {
  useStoryCreate,
  useStoryImageUpload,
} from "../../hooks/useStoryMutations";
import { getFilesToUpload } from "../../utils/story";
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
  const { stellaId } = useParams() as { stellaId: string };

  // Backend mutation hooks
  const storyCreate = useStoryCreate();
  const storyImageUpload = useStoryImageUpload();

  const handleSave = async (data: CoverPageData) => {
    try {
      const currentStoryId = `story_${uuidv4()}`;
      const filesToUpload = getFilesToUpload(data);
      const updatedData = { ...data };

      // Upload files if any
      for (const fileUpload of filesToUpload) {
        const formData = new FormData();
        formData.append("image", fileUpload.file);
        formData.append("imageId", fileUpload.imageId);

        const result = await new Promise<any>((resolve, reject) => {
          storyImageUpload.mutate(
            { stellaId, storyId: currentStoryId, formData },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });

        const imageKey = result.key || result.url || fileUpload.imageId;
        updatedData[fileUpload.elementKey] = {
          ...updatedData[fileUpload.elementKey],
          value: imageKey,
          imageKey,
        };
      }

      // Create story with updated cover page data
      storyCreate.mutate(
        {
          stellaId,
          storyData: {
            coverPage: updatedData,
          },
        },
        {
          onSuccess: (response) => {
            console.log("Story created successfully");
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
          onError: (error) => {
            console.error("Failed to create story:", error);
          },
        }
      );
    } catch (error) {
      console.error("Failed to save story:", error);
    }
  };

  const dataRef = useRef<CoverPageData | null>(null);

  // Handlers
  const handleCoverPageChange = (updatedData: Record<string, any>) => {
    dataRef.current = updatedData as CoverPageData;
  };

  const handleSaveClick = () => {
    if (dataRef.current) {
      handleSave(dataRef.current);
    }
  };

  // Get status for UI
  const isLoading = storyCreate.isPending || storyImageUpload.isPending;
  const buttonText = isLoading ? "Saving..." : "Add Story";
  const hasError = storyCreate.isError || storyImageUpload.isError;

  return (
    <div className={style.addStoryWrapper}>
      Create Story
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
          onClick={handleSaveClick}
          disabled={isLoading}
        >
          {buttonText}
        </Button>
      </Bar>
    </div>
  );
};

export default CreateStory;
