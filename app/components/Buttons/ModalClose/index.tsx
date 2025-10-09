import { X } from "react-feather";
import { useGlobalContext } from "../../../context/Global";
import Button from "../../ButtonWrapper";

const ModalClose = () => {
  const { dispatch } = useGlobalContext();

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
