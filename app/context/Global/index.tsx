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
  firebaseId?: string;
  stellaId?: string;
  username?: string;
  bio?: string;
  profileImageKey?: string;
};

// Define all possible actions
type Action =
  | { type: "CLEAR_STATE" }
  | { type: "CLEAR_PROFILE" }
  | { type: "SET_FIREBASE_ID"; payload: string }
  | { type: "SET_STELLA_ID"; payload: string }
  | { type: "SET_PROFILE"; payload: Partial<State> };

// Context type
type ContextType = { state: State; dispatch: Dispatch<Action> };

const initialState: State = {};

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
        profileImageKey: "",
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
      return initialState;
    }
    default:
      throw new Error(`Unhandled action type: ${(action as any).type}`);
  }
}

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);
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
