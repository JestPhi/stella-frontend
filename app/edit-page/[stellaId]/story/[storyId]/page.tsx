"use client";

import { useParams } from "next/navigation";
import { useRef } from "react";

import { useStory } from "../../../../hooks/useStories";
import { useStoryUpdate } from "../../../../hooks/useStoryMutations";

import Bar from "../../../../components/Bar";
import Button from "../../../../components/Button";
import Panels from "../../../../components/Panels";
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

type MenuPageEditProps = {
  onChange: () => Promise<void>;
  page?: any;
  stellaId: string;
  storyId: string;
};

const MenuPageEdit = ({}: MenuPageEditProps) => {
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

  // Backend mutation hook
  const storyUpdate = useStoryUpdate();

  const handlePanelsChange = (items: Record<string, PanelItem>) => {
    console.log(items);
    pageData.current = items;
  };

  const handleSave = async () => {
    storyUpdate.mutate(
      {
        stellaId,
        updateData: {
          storyId,
          coverPage: pageData.current,
        },
      },
      {
        onSuccess: () => {
          parent.postMessage(
            {
              type: "SET_LAYOUT",
              payload: {
                modalVisible: false,
                basePathname: `/profile/${stellaId}/story/${storyId}?update=${Date.now()}`,
              },
            },
            `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
          );
        },
        onError: (error) => {
          console.error("Failed to update story:", error);
        },
      }
    );
  };

  return (
    <div className={style.addStoryWrapper}>
      <Panels
        items={storyData?.story?.coverPage}
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
          update story
        </Button>
      </Bar>
    </div>
  );
};

export default MenuPageEdit;
