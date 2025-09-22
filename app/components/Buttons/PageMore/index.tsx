"use client";

import { useGlobalContext } from "@/context/Global";
import { useModalContext } from "@/context/Modal";
import { useParams } from "next/navigation";
import { MoreHorizontal } from "react-feather";
import Button from "../../Button";
import StoryActions from "../../ModalContent/StoryActions";

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
