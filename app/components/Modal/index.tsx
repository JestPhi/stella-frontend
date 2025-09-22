"use client";

import { useModalContext } from "../../context/Modal";
import styles from "./style.module.css";

const Modal = () => {
  const { state, dispatch } = useModalContext();

  const handleClose = () => {
    dispatch({
      type: "HIDE_MODAL",
    });

    if (typeof state.modalOnClose === "function") {
      state?.modalOnClose();
    }
  };

  if (!state.visible) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.backdrop} onClick={handleClose} />
      <div
        className={styles.content}
        style={{ height: state.height || "100vh" }}
      >
        {state.content}
      </div>
    </div>
  );
};

export default Modal;
