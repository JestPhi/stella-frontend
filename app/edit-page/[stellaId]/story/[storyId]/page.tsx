"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { CoverPageData, FileUpload } from "../../../../src/types/story";
import { storyAPI } from "../../../../api/story";
import { getFilesToUpload } from "../../../../utils/story";

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
  const { stellaId, storyId } = useParams();
  const pageData = useRef({});

  // Fetch story data by storyId
  const { data: storyData } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => storyAPI.getById(stellaId, storyId!),
    enabled: !!storyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const coverPageUpdateMutation = useMutation({
    mutationFn: async (coverPageData: CoverPageData) => {
      if (!storyId) throw new Error("Story ID required");
      return storyAPI.update(stellaId, storyId, coverPageData);
    },
    onSuccess: async () => {
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
  });

  const handlePanelsChange = (items: Record<string, PanelItem>) => {
    console.log(items);
    pageData.current = items;
  };

  const handleSave = async () => {
    coverPageUpdateMutation.mutate(pageData.current);
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
