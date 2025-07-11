import { useEffect } from "react";
import { createContext, useContext, useState, ReactNode } from "react";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router";
import {
  getAuth,
  onAuthStateChanged,
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
const AuthContext = createContext(null);
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [firebaseAuthState, setFirebaseAuthState] = useState();
  const { dispatch } = useGlobalContext();

  const signOut = () => {
    const auth = getAuth(app);
    signOutAuth(auth)
      .then(() => {})
      .catch((error) => {});
  };

  const signIn = () => {
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
      .then((result) => {})
      .catch((error) => {});
  };

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseAuthState(user);
      } else {
        setFirebaseAuthState(null);
      }
    });
  }, []);

  useEffect(() => {
    if (firebaseAuthState === null) {
      navigate("/signin");
    }
    if (firebaseAuthState) {
      getUserByFirebaseId(firebaseAuthState?.uid).then((doc) => {
        if (!doc) {
          dispatch({
            type: "SET_MENU",
            payload: {
              template: <MenuSignUp />,
              heading: "Sign Up / Sign In",
            },
          });
        }
        if (doc) {
          navigate("/");
        }
      });
    }
  }, [firebaseAuthState]);

  return (
    <AuthContext.Provider
      value={{ firebaseAuth: firebaseAuthState, signOut, signIn }}
    >
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
