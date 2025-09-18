"use client";

import { useParams } from "next/navigation";
import { useRef } from "react";

import { useStory } from "../../../hooks/useStories";
import {
  usePageUpdateById,
  useStoryUpdate,
} from "../../../hooks/useStoryMutations";

import { useGlobalContext } from "../../../context/Global";
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
  const params = useParams();
  const stellaId = params?.stellaId as string;
  const storyId = params?.storyId as string;
  const pageData = useRef({});

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
    // Convert pageId to number for array access
    const pageIndex = parseInt(pageId, 10);
    return storyData?.story?.pages?.[pageIndex]?.panels;
  };

  // Backend mutation hook
  const storyUpdate = useStoryUpdate();
  const pageUpdateById = usePageUpdateById();

  const handlePanelsChange = (items: Record<string, PanelItem>) => {
    pageData.current = items;
  };

  const getUpdatedPage = () => {
    if (pageId === "COVER_PAGE") {
      return {
        storyId,
        coverPage: pageData.current,
      };
    }
    // TODO update numbered pages
    return {
      storyId,
      panels: pageData.current,
    };
  };

  const handleSave = async () => {
    if (pageId === "COVER_PAGE") {
      storyUpdate.mutate(
        {
          stellaId,
          storyId: storyId,
          updateData: getUpdatedPage(),
        },
        {
          onSuccess: () => {
            dispatch({
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
        updateData: getUpdatedPage(),
      },
      {
        onSuccess: () => {
          dispatch({
            type: "HIDE_MODAL",
          });
        },
      }
    );
  };

  return (
    <div className={style.addStoryWrapper}>
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
          disabled={!stellaId}
        >
          update {pageId} page
        </Button>
      </Bar>
    </div>
  );
};

export default EditPage;
