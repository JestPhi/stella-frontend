"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

// Define the shape of your state
type State = {
  visible?: boolean;
  height?: string;
  content?: ReactNode;
  modalOnClose?: () => void;
};

// Define all possible actions
type Action = { type: "HIDE_MODAL" } | { type: "SHOW_MODAL"; payload: any };

// Context type
type ContextType = { state: State; dispatch: Dispatch<Action> };

const initialState: State = {
  visible: false,
  height: undefined,
  content: undefined,
  modalOnClose: undefined,
};

const ModalContext = createContext<ContextType | undefined>(undefined);

function modalReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SHOW_MODAL": {
      return {
        ...state,
        visible: true,
        ...action.payload,
      };
    }
    case "HIDE_MODAL": {
      return {
        ...state,
        ...initialState,
      };
    }
    default:
      throw new Error(`Unhandled action type: ${(action as any).type}`);
  }
}

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);
  const value = { state, dispatch };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

const useModalContext = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

export { ModalProvider, useModalContext };
