"use client";

import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGlobalContext } from "../../../context/Global";
import {
  useStoryCreate,
  useStoryImageUpload,
} from "../../../hooks/useStoryMutations";
import { CoverPageData } from "../../../types/story";
import { getFilesToUpload } from "../../../utils/story";
import Bar from "../../Bar";
import Button from "../../Button";
import Panels from "../../Panels";

import { useRouter } from "next/navigation";
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
  const {
    dispatch,
    state: { stellaId },
  } = useGlobalContext();

  // Backend mutation hooks
  const router = useRouter();
  const storyCreate = useStoryCreate();
  const storyImageUpload = useStoryImageUpload();

  // State to track if we have both text and image
  const [hasText, setHasText] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  const handleSave = async (data: CoverPageData) => {
    if (!stellaId) {
      console.error("No stellaId available");
      return;
    }

    try {
      const currentStoryId = `story_${uuidv4()}`;
      const filesToUpload = getFilesToUpload(data);
      const updatedData = { ...data };

      // Upload files if any
      for (const fileUpload of filesToUpload) {
        const formData = new FormData();
        console.log(fileUpload);
        formData.append("file", fileUpload.file);
        formData.append("imageKey", fileUpload.imageKey);

        const result = await new Promise<any>((resolve, reject) => {
          storyImageUpload.mutate(
            { stellaId, storyId: currentStoryId, formData },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });

        const imageKey = result.key || result.url || fileUpload.imageKey;
        updatedData[fileUpload.elementKey] = {
          ...updatedData[fileUpload.elementKey],
          value: imageKey, // Set the uploaded image key/URL
        };
      }

      // Create story with updated cover page data
      storyCreate.mutate(
        {
          stellaId,
          storyData: {
            coverPage: updatedData,
          },
          storyId: currentStoryId,
        },
        {
          onSuccess: (response) => {
            dispatch({
              type: "HIDE_MODAL",
            });
            router.push(`/profile/${stellaId}/story/${currentStoryId}`);
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

    // Check if we have text (element "1" is the text input)
    const textElement = updatedData["1"];
    const hasTextValue =
      textElement?.value && textElement.value.trim().length > 0;
    setHasText(hasTextValue);

    // Check if we have an image (element "0" is the image)
    const imageElement = updatedData["0"];
    const hasImageValue = imageElement?.value || imageElement?.file;
    setHasImage(!!hasImageValue);
  };

  const handleSaveClick = () => {
    if (dataRef.current) {
      handleSave(dataRef.current);
    }
  };

  // Get status for UI
  const isLoading = storyCreate.isPending || storyImageUpload.isPending;
  const buttonText = isLoading ? "Uploading..." : "Create Story";
  const hasError = storyCreate.isError || storyImageUpload.isError;

  return (
    <div className={style.addStoryWrapper}>
      <Bar className={style.createStory}>
        {hasText && hasImage && (
          <Button
            className={style.addStory}
            variant="primary"
            onClick={handleSaveClick}
          >
            {buttonText}
          </Button>
        )}
      </Bar>
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
    </div>
  );
};

export default CreateStory;
