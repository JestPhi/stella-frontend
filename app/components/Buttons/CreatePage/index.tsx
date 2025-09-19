"use client";

import { useParams } from "next/navigation";
import { Plus } from "react-feather";
import { useGlobalContext } from "../../../context/Global";
import CreatePageContent from "../../ModalContent/CreatePage";

import Button from "../../Button";

const CreatePage = ({}) => {
  const { dispatch } = useGlobalContext();
  const params = useParams();
  const storyId = params?.storyId as string;

  if (!storyId) {
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
            modalContent: <CreatePageContent />,
          },
        });
      }}
    >
      <Plus />
    </Button>
  );
};

export default CreatePage;
