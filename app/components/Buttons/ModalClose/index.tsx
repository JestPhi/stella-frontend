import { useModalContext } from "@/context/Modal";
import { X } from "react-feather";
import Button from "../../Button";

const ModalClose = () => {
  const { dispatch } = useModalContext();

  return (
    <Button
      onClick={() => {
        dispatch({ type: "HIDE_MODAL" });
      }}
    >
      <X />
    </Button>
  );
};

export default ModalClose;
