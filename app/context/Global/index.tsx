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
  menu: any;
  firebaseId?: string;
  stellaId?: string;
  username?: string;
  bio?: string;
  globalImageKey?: string;
  showGlobalCreationModal?: boolean;
  modalVisible?: boolean;
  modalHeight?: string;
  modalContent?: ReactNode;
};

// Define all possible actions
type Action =
  | { type: "CLEAR_STATE" }
  | { type: "HIDE_MODAL" }
  | { type: "SET_MODAL"; payload: any }
  | { type: "CLEAR_PROFILE" }
  | { type: "SET_FIREBASE_ID"; payload: string }
  | { type: "SET_STELLA_ID"; payload: string }
  | { type: "SET_PROFILE"; payload: Partial<State> }
  | { type: "SHOW_PROFILE_CREATION_MODAL" };

// Context type
type ContextType = { state: State; dispatch: Dispatch<Action> };

const initalState: State = {};

const GlobalContext = createContext<ContextType | undefined>(undefined);

function globalReducer(state: State, action: Action): State {
  switch (action.type) {
    case "CLEAR_PROFILE":
      return {
        ...state,
        firebaseId: "",
        stellaId: "",
        username: "",
        bio: "",
        globalImageKey: "",
        showGlobalCreationModal: false,
      };
    case "SET_FIREBASE_ID":
      return {
        ...state,
        firebaseId: action.payload,
      };
    case "SET_STELLA_ID":
      return {
        ...state,
        stellaId: action.payload,
      };
    case "SET_PROFILE":
      return { ...state, ...action.payload };
    case "CLEAR_STATE": {
      return initalState;
    }
    case "SHOW_PROFILE_CREATION_MODAL":
      return {
        ...state,
        showGlobalCreationModal: true,
      };
    case "SET_MODAL": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "HIDE_MODAL": {
      return {
        ...state,
        modalHeight: undefined,
        modalContent: undefined,
        modalVisible: false,
      };
    }
    default:
      throw new Error(`Unhandled action type: ${(action as any).type}`);
  }
}

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, initalState);
  const value = { state, dispatch };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export { GlobalProvider, useGlobalContext };
