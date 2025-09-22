import { create } from "zustand";

const INITIAL_MODAL_STATE = {
  content: null,
  visible: false,
  height: null,
};

const useModalStore = create((set) => ({
  content: null,
  visible: false,
  height: null,
  showModal: () =>
    set((state) => ({
      content: state.visible,
      height: state.height,
      visible: true,
    })),
  hideModal: () => set(INITIAL_MODAL_STATE),
}));

export default useModalStore;
