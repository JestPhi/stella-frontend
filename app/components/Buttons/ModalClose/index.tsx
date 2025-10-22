import { useModalContext } from "@/context/Modal";
import { X } from "react-feather";
import ButtonWrapper from "../../ButtonWrapper";
import styles from "./style.module.css";

const ModalClose = () => {
  const { dispatch } = useModalContext();

  return (
    <ButtonWrapper
      onClick={() => {
        dispatch({ type: "HIDE_MODAL" });
      }}
    >
      <button className={styles.closeButton}>
        <X />
      </button>
    </ButtonWrapper>
  );
};

export default ModalClose;
