"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

import style from "./style.module.css";
// import MenuPageEdit from "../../../components/MenuPageEdit";
import Button from "../../../../components/Button";

const MenuPageMore = ({
  isCoverPage,
}: {
  isCoverPage: boolean;
  stellaId: string;
  storyId: string;
}) => {
  const { stellaId, storyId } = useParams();
  const queryClient = useQueryClient();

  // Delete story mutation
  const deleteStoryMutation = useMutation({
    mutationFn: async (storyId: string) => {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}/stories/${storyId}`
      );
      return data;
    },
    onSuccess: async () => {
      // Invalidate and refetch stories queries
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["stories", stellaId] });

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
      //   await onDelete();
      // Close the menu
      //   dispatch({ type: "SET_MENU", payload: null });

      //   // Optional: Navigate back to profile or home
      //   router.push(`/profiles/${stellaId}`);
    },
    onError: (error) => {
      console.error("Failed to delete story:", error);
      // You could add a toast notification here
    },
  });

  const handleDeleteStory = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    ) {
      deleteStoryMutation.mutate(storyId);
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
        {!isCoverPage && <Button className={style.action}>Delete Page</Button>}
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

export default MenuPageMore;
