"use client";

import Button from "@/components/Button";
import CreateStoryContent from "@/components/ModalContent/CreateStory";
import { useModalContext } from "@/context/Modal";
import { useParams } from "next/navigation";
import { Plus } from "react-feather";

const CreateStory = ({}) => {
  const params = useParams();
  const stellaId = params?.stellaId as string;
  const storyId = params?.storyId as string;
  const { state, dispatch } = useModalContext();

  if (stellaId && storyId) {
    return null;
  }

  return (
    <Button
      onClick={() => {
        dispatch({
          type: "SHOW_MODAL",
          payload: {
            height: "calc(100vh - 44px)",
            content: <CreateStoryContent />,
          },
        });
      }}
    >
      <Plus height={24} width={24} />
    </Button>
  );
};

export default CreateStory;
