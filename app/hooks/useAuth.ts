import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as signOutAuth,
} from "@firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";

const provider = new GoogleAuthProvider();

const signOut = async () => {
  return signOutAuth(auth)
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
  const [firebaseIdState, setFirebaseIdState] = useState<
    string | null | undefined
  >(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseIdState(user.uid);
      } else {
        setFirebaseIdState(null);
      }
    });
  }, []);
  console.log(firebaseIdState);
  return { firebaseId: firebaseIdState, signIn, signOut };
};

export default useAuth;
