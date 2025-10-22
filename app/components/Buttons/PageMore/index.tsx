"use client";

import Button from "@/components/Button";
import StoryActions from "@/components/ModalContent/StoryActions";
import { useGlobalContext } from "@/context/Global";
import { useModalContext } from "@/context/Modal";
import { useParams } from "next/navigation";
import { MoreHorizontal } from "react-feather";

const PageMore = ({ pageId }: { pageId: string }) => {
  const { dispatch } = useModalContext();
  const { state } = useGlobalContext();
  const params = useParams();
  const isOwner = state.stellaId === params.stellaId;

  return isOwner ? (
    <Button
      onClick={() => {
        dispatch({
          type: "SHOW_MODAL",
          payload: {
            content: <StoryActions pageId={pageId} />,
            height: "400px",
          },
        });
      }}
    >
      <MoreHorizontal color="#444" height={18} />
    </Button>
  ) : null;
};

export default PageMore;
