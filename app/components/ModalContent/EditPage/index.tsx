"use client";

import { useParams } from "next/navigation";
import { useRef } from "react";

import { useStory } from "../../../hooks/useStories";
import {
  usePageUpdateById,
  useStoryImageUpload,
  useStoryUpdate,
} from "../../../hooks/useStoryMutations";

import { useModalContext } from "@/context/Modal";
import { useGlobalContext } from "../../../context/Global";
import { CoverPageData } from "../../../types/story";
import { getFilesToUpload } from "../../../utils/story";
import Bar from "../../Bar";
import Button from "../../Button";
import Panels from "../../Panels";
import style from "./style.module.css";

// PanelItem type definition to match Panels component
type GridConfig = {
  c?: number;
  r?: number;
  cs?: number;
  rs?: number;
};

type PanelItem = {
  grid?: GridConfig;
  skeleton?: string;
  type: string;
  className?: string;
  placeholder?: string;
  value?: string | File | null;
};

const EditPage = ({ pageId }: { pageId: string }) => {
  const { dispatch, state } = useGlobalContext();
  const { dispatch: modalDispatch } = useModalContext();
  const params = useParams();
  const stellaId = params?.stellaId as string;
  const storyId = params?.storyId as string;
  const pageData = useRef<Record<string, any>>({});

  // Fetch story data via backend API
  const { data: storyResponse } = useStory(
    stellaId as string,
    storyId as string
  );

  const storyData = storyResponse;

  const getItems = () => {
    if (pageId === "COVER_PAGE") {
      return storyData?.story?.coverPage;
    }
    return storyData?.story?.pages?.[pageId]?.panels;
  };

  // Backend mutation hooks
  const storyUpdate = useStoryUpdate();
  const pageUpdateById = usePageUpdateById();
  const storyImageUpload = useStoryImageUpload();

  const handlePanelsChange = (items: Record<string, PanelItem>) => {
    pageData.current = items;
  };

  const handleSave = async () => {
    try {
      const currentData = pageData.current as Record<string, any>;
      const filesToUpload = getFilesToUpload(currentData as CoverPageData);
      const updatedData = { ...currentData };

      // Upload files if any
      for (const fileUpload of filesToUpload) {
        const formData = new FormData();
        formData.append("file", fileUpload.file);
        formData.append("imageKey", fileUpload.imageKey);

        const result = await new Promise<any>((resolve, reject) => {
          storyImageUpload.mutate(
            { stellaId, storyId, formData },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });

        const imageKey = result.key || result.url || fileUpload.imageKey;
        updatedData[fileUpload.elementKey] = {
          ...updatedData[fileUpload.elementKey],
          value: imageKey,
        };
      }

      if (pageId === "COVER_PAGE") {
        storyUpdate.mutate(
          {
            stellaId,
            storyId: storyId,
            updateData: {
              coverPage: updatedData,
            },
          },
          {
            onSuccess: () => {
              modalDispatch({
                type: "HIDE_MODAL",
              });
            },
            onError: (error) => {
              console.error("Failed to update story:", error);
            },
          }
        );
        return;
      }

      pageUpdateById.mutate(
        {
          stellaId: stellaId,
          storyId: storyId,
          pageId: pageId,
          updateData: {
            panels: updatedData,
          },
        },
        {
          onSuccess: () => {
            modalDispatch({
              type: "HIDE_MODAL",
            });
          },
          onError: (error) => {
            console.error("Failed to update page:", error);
          },
        }
      );
    } catch (error) {
      console.error("Failed to save page:", error);
    }
  };

  // Get status for UI
  const isLoading =
    storyUpdate.isPending ||
    pageUpdateById.isPending ||
    storyImageUpload.isPending;
  const buttonText = isLoading ? "Saving..." : `Update ${pageId} page`;
  const hasError =
    storyUpdate.isError || pageUpdateById.isError || storyImageUpload.isError;

  return (
    <div className={style.addStoryWrapper}>
      {hasError && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          Failed to update page. Please try again.
        </div>
      )}
      <Panels
        items={getItems()}
        isEditMode
        className={style.panels}
        onChange={handlePanelsChange}
      />

      <Bar className={style.bar} variant="default">
        <Button
          className={style.addStory}
          variant="primary"
          onClick={handleSave}
          disabled={!stellaId || isLoading}
        >
          {buttonText}
        </Button>
      </Bar>
    </div>
  );
};

export default EditPage;
