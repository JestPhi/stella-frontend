import { createContext, useContext, useState, ReactNode } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as signOutAuth,
  signInWithPopup,
} from "firebase/auth";

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

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuthState(user);
    } else {
      setAuthState(null);
    }
  });

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
        const user = result.user;
        console.log("User signed in:", user);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error signing in:", error);
      });
  };

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
