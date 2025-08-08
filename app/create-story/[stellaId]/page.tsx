"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { CoverPageData, FileUpload } from "../../types/story";

import { storyAPI } from "../../api/story";
import { getFilesToUpload } from "../../utils/story";
import Bar from "../../components/Bar";
import Button from "../../components/Button";
import Panels from "../../components/Panels";
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

// Loading component
const LoadingState = ({ message }: { message: string }) => (
  <div className={style.addStoryWrapper}>
    <div style={{ textAlign: "center", padding: "20px" }}>{message}</div>
  </div>
);

// Error component
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className={style.addStoryWrapper}>
    <div style={{ color: "red", textAlign: "center", padding: "20px" }}>
      {message}
    </div>
    <Bar className={style.bar} variant="default">
      <Button className={style.addStory} variant="primary" onClick={onRetry}>
        Retry
      </Button>
    </Bar>
  </div>
);

const CreateStory = () => {
  const { stellaId } = useParams();
  const [coverPageData, setCoverPageData] = useState<CoverPageData>(
    INITIAL_COVER_PAGE_STATE
  );
  const [newCoverPageData, setNewCoverPageData] = useState({});
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);

  // Create story query
  const storyCreationQuery = useQuery({
    queryKey: ["createStory", stellaId],
    queryFn: async () => {
      if (!stellaId || Array.isArray(stellaId))
        throw new Error("Invalid user ID");

      const data = await storyAPI.create(stellaId, INITIAL_COVER_PAGE_STATE);
      const storyId = data?.story?.storyId;

      if (!storyId) throw new Error("No story ID returned");

      setCurrentStoryId(storyId);
      return { storyId, data };
    },
    enabled: !!stellaId,
    retry: 3,
  });

  // Combined save mutation that handles both uploads and updates
  const saveMutation = useMutation({
    mutationFn: async (data: CoverPageData) => {
      if (!currentStoryId) throw new Error("Story ID required");

      const filesToUpload = getFilesToUpload(data);
      const updatedData = { ...data };

      // Upload files if any
      for (const fileUpload of filesToUpload) {
        const result = await storyAPI.uploadImage(
          currentStoryId,
          fileUpload.file,
          fileUpload.imageId
        );
        debugger;
        const imageKey = result.key || result.url || fileUpload.imageId;
        updatedData[fileUpload.elementKey] = {
          ...updatedData[fileUpload.elementKey],
          value: imageKey,
          imageKey,
        };
      }

      // Update story
      await storyAPI.update(currentStoryId, updatedData);
      return updatedData;
    },
    onSuccess: (updatedData) => {
      setCoverPageData(updatedData);
      // Navigate or send message to parent
      parent.postMessage(
        {
          action: "SET_BASE_URL",
          payload: `/profile/${stellaId}/${currentStoryId}`,
        },
        "http://localhost:3015"
      );
    },
  });

  // Handlers
  const handleCoverPageChange = (updatedData: Record<string, any>) => {
    setNewCoverPageData(updatedData);
  };

  const handleSave = () => {
    if (currentStoryId) {
      // saveMutation.mutate(coverPageData);
    }
  };

  // Loading states
  if (storyCreationQuery.isLoading) {
    return <LoadingState message="Creating story..." />;
  }

  if (storyCreationQuery.isError) {
    return (
      <ErrorState
        message="Failed to create story. Please try again."
        onRetry={() => storyCreationQuery.refetch()}
      />
    );
  }

  // Get status for UI
  const isLoading = saveMutation.isPending;
  const buttonText = isLoading ? "Saving..." : "Add Story";
  const hasError = saveMutation.isError;

  return (
    <div className={style.addStoryWrapper}>
      {hasError && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          Failed to save story. Please try again.
        </div>
      )}

      <Panels
        items={coverPageData}
        isEditMode
        className={style.panels}
        onChange={handleCoverPageChange}
      />

      <Bar className={style.bar} variant="default">
        <Button
          className={style.addStory}
          variant="primary"
          onClick={handleSave}
          disabled={!currentStoryId || isLoading}
        >
          {buttonText}
        </Button>
      </Bar>
    </div>
  );
};

export default CreateStory;
