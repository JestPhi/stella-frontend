"use client";

import { useParams } from "next/navigation";
import { MoreHorizontal } from "react-feather";
import { useGlobalContext } from "../../../context/Global";
import Button from "../../Button";
import StoryActions from "../../ModalContent/StoryActions";

const PageMore = ({ pageId }: { pageId: string }) => {
  const { dispatch, state } = useGlobalContext();
  const params = useParams();
  const isOwner = state.stellaId === params.stellaId;

  return isOwner ? (
    <Button
      onClick={() => {
        dispatch({
          type: "SET_MODAL",
          payload: {
            modalVisible: true,
            modalContent: <StoryActions pageId={pageId} />,
            modalHeight: "400px",
          },
        });
      }}
    >
      <MoreHorizontal color="#444" height={18} />
    </Button>
  ) : null;
};

export default PageMore;
