"use client";

import { useParams } from "next/navigation";
import { useCallback, useState } from "react";

import Bar from "@/components/Bar";
import Button from "@/components/Button";
import PrimaryButton from "@/components/Buttons/Primary";
import Panels from "@/components/Panels";
import { useModalContext } from "@/context/Modal";
import { usePageEditor } from "@/hooks/usePageEditor";
import { usePageValidation } from "@/hooks/usePageValidation";
import { CoverPageData } from "@/types/story";

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
  const { dispatch: modalDispatch } = useModalContext();
  const params = useParams();
  const stellaId = params?.stellaId as string;
  const storyId = params?.storyId as string;

  const [pageData, setPageData] = useState<CoverPageData>(INITIAL_PAGE_STATE);

  const { createPage, isLoading, error } = usePageEditor({
    stellaId,
    storyId,
    onSuccess: () => modalDispatch({ type: "HIDE_MODAL" }),
  });

  const handleSave = useCallback(async () => {
    await createPage(pageData, {
      pageType: "regular",
    });
  }, [pageData, createPage]);

  const handlePanelsChange = useCallback((updatedData: Record<string, any>) => {
    setPageData(updatedData as CoverPageData);
  }, []);

  // Validate page data
  const { isValid, errors } = usePageValidation(pageData);
  const canSave = isValid && !isLoading;

  return (
    <div className={style.addStoryWrapper}>
      <Bar className={style.bar} variant="default">
        {canSave && (
          <Button variant="primary" onClick={handleSave}>
            <PrimaryButton
              className={style.addStory}
              disabled={!stellaId || !canSave}
            >
              {isLoading ? "Saving..." : "Add Page"}
            </PrimaryButton>
          </Button>
        )}
      </Bar>

      <Panels
        items={pageData}
        isEditMode
        className={style.panels}
        onChange={handlePanelsChange}
      />
    </div>
  );
};

export default CreatePage;
