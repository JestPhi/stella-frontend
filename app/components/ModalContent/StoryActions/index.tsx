"use client";

import { useModalContext } from "@/context/Modal";
import { useParams, useRouter } from "next/navigation";
import {
  usePageDelete,
  useStoryDelete,
} from "../../../hooks/useStoryMutations";
import Button from "../../Button";
import EditPage from "../../ModalContent/EditPage";
import style from "./style.module.css";

const StoryActions = ({ pageId }: { pageId: string }) => {
  const { stellaId, storyId } = useParams() as {
    stellaId: string;
    storyId: string;
  };
  const router = useRouter();
  const { dispatch } = useModalContext();

  // Backend mutation hooks
  const deletePageMutation = usePageDelete();
  const deleteStoryMutation = useStoryDelete();

  const handleDeleteStory = () => {
    deleteStoryMutation.mutate(
      { stellaId, storyId },
      {
        onSuccess: () => {
          router.push(`/profile/${stellaId}`);
          dispatch({
            type: "HIDE_MODAL",
          });
        },
        onError: (error) => {
          console.error("Failed to delete story:", error);
        },
      }
    );
  };

  const handleDeletePage = () => {
    deletePageMutation.mutate(
      { stellaId, storyId, pageId: pageId },
      {
        onSuccess: () => {
          dispatch({
            type: "HIDE_MODAL",
          });
        },
        onError: (error) => {
          console.error("Failed to delete page:", error);
        },
      }
    );
  };

  const handleEditPage = (pageId: string) => {
    dispatch({
      type: "SHOW_MODAL",
      payload: {
        content: <EditPage pageId={pageId} />,
        height: "calc(100vh - 44px)",
      },
    });
  };

  const isCoverPage = pageId === "COVER_PAGE";

  return (
    <div className={style.container}>
      <div className={style.actions}>
        <div className={style.heading}>
          {isCoverPage && "Cover "}Page Actions
        </div>
        <Button
          className={style.action}
          onClick={() => {
            handleEditPage(pageId);
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
          {deleteStoryMutation.isPending ? "Deleting Story..." : "Delete Story"}
        </Button>
      </div>
    </div>
  );
};

export default StoryActions;
