import { useEffect } from "react";
import { createContext, useContext, useState, ReactNode } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signOut as signOutAuth,
  signInWithPopup,
} from "firebase/auth";
import { getUserByFirebaseId } from "../api";
import { useGlobalContext } from "./context";
import MenuSignUp from "../components/MenuSignUp";

const firebaseConfig = {
  apiKey: "AIzaSyCjax-slr22hK8fhz4UH8TPdwPFBspnCos",
  authDomain: "stella-f5652.firebaseapp.com",
  projectId: "stella-f5652",
  storageBucket: "stella-f5652.firebasestorage.app",
  messagingSenderId: "656826535955",
  appId: "1:656826535955:web:109ac457f30f132395efe6",
  measurementId: "G-27DBFQ4ES0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const AuthContext = createContext(null);
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState(null);
  const { dispatch } = useGlobalContext();
  const user = auth.currentUser;

  const signOut = () => {
    signOutAuth(auth)
      .then(() => {
        setAuthState(null);
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error);
        // An error happened.
      });
  };

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // User signed in successfully

        setAuthState((prev) => {
          return {
            ...prev,
            firebaseId: result?.user?.uid,
          };
        });
      })
      .catch((error) => {
        // Handle errors
        console.error("Error signing in:", error);
      });
  };

  useEffect(() => {
    console.log(authState);
    if (!!authState?.firebaseId) {
      getUserByFirebaseId(authState?.firebaseId).then((doc) => {
        if (!doc) {
          dispatch({
            type: "SET_MENU",
            payload: {
              template: <MenuSignUp />,
              heading: "Sign Up / Sign In",
            },
          });
        }
      });
    }
  }, [authState?.firebaseId]);

  return (
    <AuthContext.Provider value={{ auth: authState, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuthContext };
