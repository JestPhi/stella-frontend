"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import style from "./style.module.css";
import MenuPageEdit from "../MenuPageEdit";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";

const MenuPageMore = ({
  isCoverPage,
  onChange,
  onDelete,
  page,
  stellaId,
  storyId,
}: {
  isCoverPage: boolean;
  stellaId: string;
  storyId: string;
}) => {
  const router = useRouter();
  const { dispatch, state } = useGlobalContext();
  const queryClient = useQueryClient();

  // Delete story mutation
  const deleteStoryMutation = useMutation({
    mutationFn: async (storyId: string) => {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/story/${storyId}`
      );
      return data;
    },
    onSuccess: async () => {
      // Invalidate and refetch stories queries
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["stories", stellaId] });

      await onDelete();
      // Close the menu
      dispatch({ type: "SET_MENU", payload: null });

      // Optional: Navigate back to profile or home
      router.push(`/profile/${stellaId}`);
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
    <div className={style.MenuPageMore}>
      <div className={style.actions}>
        <div className={style.heading}>
          {isCoverPage && "Cover "}Page Actions
        </div>
        <Button
          className={style.action}
          onClick={() => {
            dispatch({
              type: "SET_MENU",
              payload: {
                heading: "Edit Page",
                template: (
                  <MenuPageEdit
                    onChange={onChange}
                    page={page}
                    stellaId={stellaId}
                    storyId={storyId}
                  />
                ),
              },
            });
          }}
        >
          Edit {isCoverPage && "Cover "} Page
        </Button>
        {!isCoverPage && (
          <Button className={style.action}>
            Create new page & insert between page 4...5
          </Button>
        )}
        {!isCoverPage && <Button className={style.action}>Delete Page</Button>}
      </div>
      <div className={style.actions}>
        <div className={[style.heading, style.pageActionsHeading].join(" ")}>
          Story Actions
        </div>
        <Button className={style.action}>Change page sequence</Button>
        <Button className={style.action}>Order pages by Page Number</Button>
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
