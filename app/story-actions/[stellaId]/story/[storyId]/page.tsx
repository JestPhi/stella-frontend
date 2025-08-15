"use client";

import { useParams } from "next/navigation";

import Button from "../../../../components/Button";
import {
  usePageDelete,
  useStoryDelete,
} from "../../../../hooks/useStoryMutations";
import style from "./style.module.css";

const StoryActions = ({
  isCoverPage,
  pageId,
}: {
  isCoverPage: boolean;
  stellaId: string;
  storyId: string;
  pageId?: string;
}) => {
  const { stellaId, storyId } = useParams() as {
    stellaId: string;
    storyId: string;
  };

  // Backend mutation hooks
  const deletePageMutation = usePageDelete();
  const deleteStoryMutation = useStoryDelete();

  const handleDeleteStory = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    ) {
      deleteStoryMutation.mutate(
        { stellaId, storyId },
        {
          onSuccess: () => {
            parent.postMessage(
              {
                type: "SET_LAYOUT",
                payload: {
                  basePathname: `/profile/${stellaId}`,
                  modalVisible: false,
                },
              },
              `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
            );
          },
          onError: (error) => {
            console.error("Failed to delete story:", error);
          },
        }
      );
    }
  };

  const handleDeletePage = () => {
    // get url query parameter
    const searchParams = new URLSearchParams(window.location.search);
    const pageIdFromQuery = searchParams.get("pageId");

    if (!pageIdFromQuery) {
      console.error("Page ID is required to delete a page");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this page? This action cannot be undone."
      )
    ) {
      deletePageMutation.mutate(
        { stellaId, storyId, pageId: pageIdFromQuery },
        {
          onSuccess: () => {
            parent.postMessage(
              {
                type: "SET_LAYOUT",
                payload: {
                  basePathname: `/profile/${stellaId}/story/${storyId}?udpated=${Date.now()}`,
                  modalVisible: false,
                },
              },
              `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
            );
          },
          onError: (error) => {
            console.error("Failed to delete page:", error);
          },
        }
      );
    }
  };

  return (
    <div className={style.container}>
      <div className={style.actions}>
        <div className={style.heading}>
          {isCoverPage && "Cover "}Page Actions
        </div>
        <Button
          className={style.action}
          onClick={() => {
            parent.postMessage(
              {
                type: "SET_LAYOUT",
                payload: {
                  modalHeight: undefined,
                  modalPathname: `/edit-page/${stellaId}/story/${storyId}`,
                },
              },
              `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
            );
          }}
        >
          Edit {isCoverPage && "Cover "} Page
        </Button>
        {!isCoverPage && (
          <Button
            className={style.action}
            onClick={handleDeletePage}
            disabled={deletePageMutation.isPending}
          >
            {deletePageMutation.isPending ? "Deleting..." : "Delete Page"}
          </Button>
        )}
      </div>
      <div className={style.actions}>
        <div className={[style.heading, style.pageActionsHeading].join(" ")}>
          Story Actions
        </div>
        <Button
          className={style.action}
          onClick={handleDeleteStory}
          disabled={deleteStoryMutation.isPending}
        >
          {deleteStoryMutation.isPending ? "Deleting..." : "Delete Story"}
        </Button>
      </div>
    </div>
  );
};

export default StoryActions;
