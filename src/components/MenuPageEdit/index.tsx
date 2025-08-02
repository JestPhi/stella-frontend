import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";

import { CoverPageData, FileUpload } from "../../types/story";
import { useGlobalContext } from "../../context/context";
import { storyAPI } from "../../api/story";
import { getFilesToUpload } from "../../utils/story";

import Bar from "../Bar";
import Button from "../Button";
import Panels from "../Panels";
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

const MenuPageEdit = ({
  onChange,
  page,
  stellaId,
  storyId,
}: MenuPageEditProps) => {
  const [coverPageData, setCoverPageData] = useState<CoverPageData>({});
  const { dispatch, state } = useGlobalContext();
  const navigate = useNavigate();

  // Fetch story data by storyId
  const {
    data: storyData,
    isLoading: isStoryLoading,
    isError: isStoryError,
    error: storyError,
  } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => storyAPI.getById(storyId!),
    enabled: !!storyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set coverPageData when story loads
  useEffect(() => {
    if (storyData?.story.coverPage) {
      console.log("fire");
      setCoverPageData(storyData?.story?.coverPage);
    }
  }, [storyData?.story]);

  const coverPageUpdateMutation = useMutation({
    mutationFn: async (coverPageData: CoverPageData) => {
      if (!storyId) throw new Error("Story ID required");
      return storyAPI.update(storyId, coverPageData);
    },
    onSuccess: async () => {
      await onChange();
      dispatch({ type: "SET_MENU", payload: null });
    },
  });

  const imageUploadMutation = useMutation({
    mutationFn: async (fileUpload: FileUpload) => {
      if (!storyId) throw new Error("Story ID required");
      return storyAPI.uploadImage(storyId, fileUpload.file, fileUpload.imageId);
    },
  });

  const handlePanelsChange = (items: Record<string, PanelItem>) => {
    const convertedData: CoverPageData = {};

    Object.entries(items).forEach(([key, item]) => {
      convertedData[key] = {
        grid: {
          c: item.grid?.c ?? 0,
          r: item.grid?.r ?? 0,
          rs: item.grid?.rs ?? 1,
          cs: item.grid?.cs ?? 1,
        },
        type: item.type,
        placeholder: item.placeholder,
        value: item.value as string | File,
      };
    });

    setCoverPageData(convertedData);
  };

  const handleSave = async () => {
    if (!stellaId || imageUploadMutation.isPending) return;

    const filesToUpload = getFilesToUpload(coverPageData);
    let updatedData = { ...coverPageData };

    // Upload files and update data
    for (const fileUpload of filesToUpload) {
      try {
        const result = await imageUploadMutation.mutateAsync(fileUpload);
        const imageKey = result.key || result.url || fileUpload.imageId;

        updatedData[fileUpload.elementKey] = {
          ...updatedData[fileUpload.elementKey],
          value: imageKey,
          imageKey,
        };
      } catch (error) {
        console.error("Upload failed:", error);
        return;
      }
    }

    coverPageUpdateMutation.mutate(updatedData);
  };

  const isLoading =
    imageUploadMutation.isPending ||
    coverPageUpdateMutation.isPending ||
    isStoryLoading;
  const hasError =
    coverPageUpdateMutation.isError ||
    imageUploadMutation.isError ||
    isStoryError;

  if (isStoryLoading) return <div>Loading story...</div>;
  if (isStoryError)
    return <div>Error loading story: {storyError?.message}</div>;

  return (
    <div className={style.addStoryWrapper}>
      {hasError && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          {coverPageUpdateMutation.isError && "Failed to update story. "}
          {imageUploadMutation.isError && "Failed to upload image. "}
          Please try again.
        </div>
      )}

      <Panels
        items={coverPageData}
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
          {imageUploadMutation.isPending
            ? "Uploading..."
            : coverPageUpdateMutation.isPending
            ? "Saving..."
            : "Update Story"}
        </Button>
      </Bar>
    </div>
  );
};

export default MenuPageEdit;
