"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useModalContext } from "@/context/Modal";
import { useGlobalContext } from "../../../context/Global";
import { usePageEditor } from "../../../hooks/usePageEditor";
import { usePageValidation } from "../../../hooks/usePageValidation";
import { CoverPageData } from "../../../types/story";
import Bar from "../../Bar";
import Button from "../../Button";
import Panels from "../../Panels";

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
    state: { stellaId },
  } = useGlobalContext();
  const { dispatch: modalDispatch } = useModalContext();
  const router = useRouter();

  const [pageData, setPageData] = useState<CoverPageData>(
    INITIAL_COVER_PAGE_STATE
  );

  const storyIdRef = useRef<string | null>(null);

  const { createStory, isLoading, error } = usePageEditor({
    stellaId: stellaId || "",
    onSuccess: () => {
      modalDispatch({ type: "HIDE_MODAL" });
      if (storyIdRef.current) {
        router.push(`/profile/${stellaId}/story/${storyIdRef.current}`);
      }
    },
  });

  const handleSave = useCallback(async () => {
    if (!stellaId) return;

    const storyId = `story_${uuidv4()}`;
    storyIdRef.current = storyId;
    await createStory(pageData, storyId);
  }, [stellaId, pageData, createStory]);

  const handlePanelsChange = useCallback((updatedData: Record<string, any>) => {
    setPageData(updatedData as CoverPageData);
  }, []);

  // Validate page data
  const { isValid } = usePageValidation(pageData);
  const canSave = isValid && !isLoading;

  return (
    <div className={style.addStoryWrapper}>
      <Bar className={style.createStory}>
        {canSave && (
          <Button
            className={style.addStory}
            variant="primary"
            onClick={handleSave}
            disabled={!canSave}
          >
            {isLoading ? "Creating..." : "Create Story"}
          </Button>
        )}
      </Bar>

      {error && <div className={style.error}>{error}</div>}

      <Panels
        items={pageData}
        isEditMode
        className={style.panels}
        onChange={handlePanelsChange}
      />
    </div>
  );
};

export default CreateStory;
