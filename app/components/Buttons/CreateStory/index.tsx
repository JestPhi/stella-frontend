"use client";

import { useParams } from "next/navigation";
import { Plus } from "react-feather";
import { useGlobalContext } from "../../../context/Global";
import Button from "../../Button";
import CreateStoryContent from "../../ModalContent/CreateStory";

const CreateStory = ({}) => {
  const params = useParams();
  const stellaId = params?.stellaId as string;
  const storyId = params?.storyId as string;
  const { state, dispatch } = useGlobalContext();

  if (stellaId && storyId) {
    return null;
  }

  return (
    <Button
      onClick={() => {
        dispatch({
          type: "SET_MODAL",
          payload: {
            modalHeight: "calc(100vh - 44px)",
            modalVisible: true,
            modalContent: <CreateStoryContent />,
          },
        });
      }}
    >
      <Plus height={24} width={24} />
    </Button>
  );
};

export default CreateStory;
