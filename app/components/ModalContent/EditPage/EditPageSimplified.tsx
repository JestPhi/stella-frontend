"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import Bar from "@/components/Bar";
import Button from "@/components/Button";
import Panels from "@/components/Panels";
import { useModalContext } from "@/context/Modal";
import { usePageEditor } from "@/hooks/usePageEditor";
import { useStory } from "@/hooks/useStories";
import { CoverPageData } from "@/types/story";

import style from "./style.module.css";

type EditPageProps = {
  pageId: string;
};

const EditPage = ({ pageId }: EditPageProps) => {
  const { dispatch: modalDispatch } = useModalContext();
  const params = useParams();
  const stellaId = params?.stellaId as string;
  const storyId = params?.storyId as string;

  const [pageData, setPageData] = useState<CoverPageData>({});

  // Fetch story data
  const { data: storyResponse } = useStory(stellaId, storyId);

  const { updateCoverPage, updatePage, isLoading, error } = usePageEditor({
    stellaId,
    storyId,
    onSuccess: () => modalDispatch({ type: "HIDE_MODAL" }),
  });

  // Initialize page data when story loads
  useEffect(() => {
    if (!storyResponse?.story) return;

    const initialData =
      pageId === "COVER_PAGE"
        ? storyResponse.story.coverPage
        : storyResponse.story.pages?.[pageId]?.panels;

    if (initialData) {
      setPageData(initialData);
    }
  }, [storyResponse, pageId]);

  const handleSave = useCallback(async () => {
    if (pageId === "COVER_PAGE") {
      await updateCoverPage(pageData);
    } else {
      await updatePage(pageData, pageId);
    }
  }, [pageId, pageData, updateCoverPage, updatePage]);

  const handlePanelsChange = useCallback((updatedData: Record<string, any>) => {
    setPageData(updatedData as CoverPageData);
  }, []);

  const getButtonText = () => {
    if (isLoading) return "Saving...";
    return pageId === "COVER_PAGE" ? "Update Cover" : `Update Page ${pageId}`;
  };

  return (
    <div className={style.addStoryWrapper}>
      {error && <div className={style.error}>{error}</div>}

      <Panels
        items={pageData}
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
          {getButtonText()}
        </Button>
      </Bar>
    </div>
  );
};

export default EditPage;
