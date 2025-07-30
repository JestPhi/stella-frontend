import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut as signOutAuth,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

const signOut = () => {
  signOutAuth(auth)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

const signIn = async () => {
  const signInData = await signInWithPopup(auth, provider);

  try {
    return signInData;
  } catch (error) {
    return error;
  }
};

const useAuth = () => {
  const [firebaseIdState, setFirebaseIdState] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseIdState(user.uid);
      } else {
        setFirebaseIdState(null);
      }
    });
  }, []);

  return { firebaseId: firebaseIdState, signIn, signOut };
};

export default useAuth;
