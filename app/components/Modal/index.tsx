"use client";

import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useModalContext } from "../../context/Modal";
import styles from "./style.module.css";

const Modal = () => {
  const { state, dispatch } = useModalContext();
  const modalRef = useFocusTrap<HTMLDivElement>(state.visible);

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
    <div className={styles.modal} ref={modalRef}>
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
