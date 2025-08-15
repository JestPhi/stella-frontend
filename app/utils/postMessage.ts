/**
 * Utility for sending postMessage to parent window
 */

export type LayoutMessagePayload = {
  basePathname?: string;
  modalVisible?: boolean;
  modalPathname?: string;
  modalHeight?: number;
};

export type MessagePayload = {
  type: "SET_LAYOUT";
  payload: LayoutMessagePayload;
};

/**
 * Send a layout message to parent window
 */
export const sendLayoutMessage = (payload: LayoutMessagePayload) => {
  const message: MessagePayload = {
    type: "SET_LAYOUT",
    payload,
  };

  parent.postMessage(
    message,
    `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
  );
};
