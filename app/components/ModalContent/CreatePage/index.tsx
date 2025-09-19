"use client";

import { useParams } from "next/navigation";
import { useRef } from "react";

import { useGlobalContext } from "../../../context/Global";
import {
  usePageCreate,
  useStoryImageUpload,
} from "../../../hooks/useStoryMutations";
import { CoverPageData } from "../../../types/story";
import { getFilesToUpload } from "../../../utils/story";
import Bar from "../../Bar";
import Button from "../../Button";
import Panels from "../../Panels";
import style from "./style.module.css";

const INITIAL_PAGE_STATE = {
  "0": { grid: { c: 12, r: 10, rs: 0, cs: 0 }, type: "jpg" },
  "1": {
    grid: { c: 12, r: 2, rs: 10, cs: 0 },
    type: "text",
    placeholder: "Enter a title",
    value: "",
  },
};

const CreatePage = () => {
  const { storyId, stellaId } = useParams() as {
    stellaId: string;
    storyId: string;
  };

  // Backend mutation hooks
  const pageCreate = usePageCreate();
  const storyImageUpload = useStoryImageUpload();

  const { dispatch, state } = useGlobalContext();

  const handleSave = async (data: Record<string, any>) => {
    try {
      const filesToUpload = getFilesToUpload(data as CoverPageData);
      const updatedData = { ...data };

      // Upload files if any
      for (const fileUpload of filesToUpload) {
        const formData = new FormData();
        formData.append("file", fileUpload.file);
        formData.append("imageId", fileUpload.imageId);

        const result = await new Promise<any>((resolve, reject) => {
          storyImageUpload.mutate(
            { stellaId, storyId, formData },
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
        };
      }

      // Create page in story
      pageCreate.mutate(
        {
          stellaId,
          storyId,
          pageData: {
            content: updatedData,
          },
        },
        {
          onSuccess: () => {
            // Navigate or send message to parent
            dispatch({
              type: "HIDE_MODAL",
            });
          },
          onError: (error) => {
            console.error("Failed to create page:", error);
          },
        }
      );
    } catch (error) {
      console.error("Failed to save page:", error);
    }
  };

  const dataRef = useRef<Record<string, any> | null>(null);

  // Handlers
  const handlePageChange = (updatedData: Record<string, any>) => {
    dataRef.current = updatedData;
  };

  const handleSaveClick = () => {
    if (dataRef.current) {
      handleSave(dataRef.current);
    }
  };

  // Get status for UI
  const isLoading = pageCreate.isPending || storyImageUpload.isPending;
  const buttonText = isLoading ? "Saving..." : "Add Page";
  const hasError = pageCreate.isError || storyImageUpload.isError;

  return (
    <div className={style.addStoryWrapper}>
      {hasError && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          Failed to save page. Please try again.
        </div>
      )}
      <Panels
        items={INITIAL_PAGE_STATE}
        isEditMode
        className={style.panels}
        onChange={handlePageChange}
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

export default CreatePage;
