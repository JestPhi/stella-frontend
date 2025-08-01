import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
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

const MenuPageEdit = () => {
  const { stellaId } = useParams();
  const [coverPageData, setCoverPageData] = useState<CoverPageData>({});
  const { dispatch, state } = useGlobalContext();
  const navigate = useNavigate();

  // Fetch story data by storyId
  const {
    data: story,
    isLoading: isStoryLoading,
    isError: isStoryError,
    error: storyError,
  } = useQuery({
    queryKey: ["story", stellaId],
    queryFn: () => storyAPI.getById(stellaId!),
    enabled: !!stellaId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log(story, stellaId);

  // Initialize coverPageData with story data when available
  useEffect(() => {
    if (story?.coverPage) {
      setCoverPageData(story.coverPage);
    }
  }, [story]);

  const coverPageUpdateMutation = useMutation({
    mutationFn: async (coverPageData: CoverPageData) => {
      if (!stellaId) throw new Error("Story ID required");
      return storyAPI.update(stellaId, coverPageData);
    },
    onSuccess: () => {
      dispatch({ type: "SET_MENU", payload: null });
      navigate(`/profile/${state.stellaId}/${stellaId}`);
    },
  });

  const imageUploadMutation = useMutation({
    mutationFn: async (fileUpload: FileUpload) => {
      if (!stellaId) throw new Error("Story ID required");
      return storyAPI.uploadImage(
        stellaId,
        fileUpload.file,
        fileUpload.imageId
      );
    },
  });

  // const handleCoverPageChange = (updatedData: CoverPageData) => {
  //   setCoverPageData(updatedData);
  // };

  const handlePanelsChange = (items: Record<string, PanelItem>) => {
    // Convert PanelItem to CoverPageElement format
    const convertedData: CoverPageData = {};

    Object.entries(items).forEach(([key, item]) => {
      // Ensure grid has all required properties with proper defaults
      const grid = item.grid
        ? {
            c: item.grid.c ?? 0,
            r: item.grid.r ?? 0,
            rs: item.grid.rs ?? 1,
            cs: item.grid.cs ?? 1,
          }
        : { c: 0, r: 0, rs: 1, cs: 1 };

      convertedData[key] = {
        grid,
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
    const updatedData = { ...coverPageData };

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

    setCoverPageData(updatedData);
    coverPageUpdateMutation.mutate(updatedData);
  };

  const isLoading =
    imageUploadMutation.isPending ||
    coverPageUpdateMutation.isPending ||
    isStoryLoading;
  const buttonText = imageUploadMutation.isPending
    ? "Uploading..."
    : coverPageUpdateMutation.isPending
    ? "Saving..."
    : "Update Story";
  const hasError =
    coverPageUpdateMutation.isError ||
    imageUploadMutation.isError ||
    isStoryError;

  // Show loading state if story is loading
  if (isStoryLoading) {
    return (
      <div className={style.addStoryWrapper}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading story...
        </div>
      </div>
    );
  }

  // Show error state if story failed to load
  if (isStoryError) {
    return (
      <div className={style.addStoryWrapper}>
        <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
          Error loading story: {storyError?.message}
        </div>
      </div>
    );
  }

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
          {buttonText}
        </Button>
      </Bar>
    </div>
  );
};

export default MenuPageEdit;
