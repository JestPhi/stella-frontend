"use client";

import useModalStore from "@/hooks/useModalStore";
import { useGlobalContext } from "../../context/Global";
import styles from "./style.module.css";

const Modal = () => {
  const { state, dispatch } = useGlobalContext();
  const modal = useModalStore();

  const handleClose = () => {
    dispatch({
      type: "HIDE_MODAL",
    });
    
    

    if (typeof state.modalOnClose === "function") {
      state?.modalOnClose();
    }
  };

  if (!state.modalVisible) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.backdrop} onClick={handleClose} />
      <div
        className={styles.content}
        style={{ height: state.modalHeight || "100vh" }}
      >
        {state.modalContent}
      </div>
    </div>
  );
};

export default Modal;
