"use client";

import { useModalContext } from "@/context/Modal";
import { useParams } from "next/navigation";
import { Plus } from "react-feather";

import Button from "../../ButtonWrapper";
import CreatePageContent from "../../ModalContent/CreatePage";

const CreatePage = ({}) => {
  const { dispatch } = useModalContext();
  const params = useParams();
  const storyId = params?.storyId as string;

  if (!storyId) {
    return null;
  }

  return (
    <Button
      onClick={() => {
        dispatch({
          type: "SHOW_MODAL",
          payload: {
            height: "calc(100vh - 44px)",
            content: <CreatePageContent />,
          },
        });
      }}
    >
      <Plus />
    </Button>
  );
};

export default CreatePage;
