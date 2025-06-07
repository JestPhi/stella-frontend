import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
} from "react";

type State = {};
type Action = { type: "increment" } | { type: "decrement" };
type ContextType = { state: State; dispatch: Dispatch<Action> };

const initalState = { menu: null };
const GlobalContext = createContext();

function globalReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_MENU":
      return { ...state, menu: action.payload };
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
