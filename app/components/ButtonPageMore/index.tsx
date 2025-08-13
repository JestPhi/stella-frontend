"use client";

import { useParams } from "next/navigation";
import { MoreHorizontal } from "react-feather";
import Button from "../../components/Button";

const ButtonPageMore = ({ pageId }) => {
  const { stellaId, storyId } = useParams();

  return (
    <Button
      onClick={() => {
        parent.postMessage(
          {
            type: "SET_LAYOUT",
            payload: {
              modalPathname: `/story-actions/${stellaId}/story/${storyId}?pageId=${pageId}`,
              modalVisible: true,
              modalHeight: 400,
            },
          },
          `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
        );
      }}
    >
      <MoreHorizontal color="#444" height={18} />
    </Button>
  );
};

export default ButtonPageMore;
