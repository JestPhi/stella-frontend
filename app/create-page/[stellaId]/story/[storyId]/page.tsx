"use client";

import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { storyAPI } from "../../../../api/story";
import Bar from "../../../../components/Bar";
import Button from "../../../../components/Button";
import Panels from "../../../../components/Panels";
import { CoverPageData } from "../../../../types/story";
import { getFilesToUpload } from "../../../../utils/story";
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
  const { stellaId, storyId } = useParams() as {
    stellaId: string;
    storyId: string;
  };

  // Combined save mutation that handles both uploads and updates
  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const currentPageId = `page_${uuidv4()}`;
      const filesToUpload = getFilesToUpload(data as CoverPageData);
      const updatedData = { ...data };

      // Upload files if any
      for (const fileUpload of filesToUpload) {
        const result = await storyAPI.uploadImage(
          stellaId,
          storyId,
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

      // Create page in story
      const response = await storyAPI.createPage(
        stellaId,
        storyId,
        currentPageId,
        updatedData as CoverPageData
      );
      return response;
    },
    onSuccess: (response) => {
      // Navigate or send message to parent
      parent.postMessage(
        {
          type: "SET_LAYOUT",
          payload: {
            basePathname: `/profile/${stellaId}/story/${storyId}?updated=${Date.now()}`,
            modalVisible: false,
          },
        },
        `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
      );
    },
  });

  const dataRef = useRef<Record<string, any> | null>(null);

  // Handlers
  const handlePageChange = (updatedData: Record<string, any>) => {
    dataRef.current = updatedData;
  };

  const handleSave = () => {
    if (dataRef.current) {
      console.log(dataRef.current);
      saveMutation.mutate(dataRef.current);
    }
  };

  // Get status for UI
  const isLoading = saveMutation.isPending;
  const buttonText = isLoading ? "Saving..." : "Add Page";

  return (
    <div className={style.addStoryWrapper}>
      Create Page
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
          onClick={handleSave}
        >
          {buttonText}
        </Button>
      </Bar>
    </div>
  );
};

export default CreatePage;
