import { useEffect, useState } from "react";
import { auth } from "../config/firebase";

/**
 * Hook that returns the current Firebase token
 */
export const useFirebaseToken = () => {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getToken = async () => {
      const user = auth.currentUser;
      if (!user) {
        setToken(undefined);
        return;
      }

      try {
        const firebaseToken = await user.getIdToken();
        setToken(firebaseToken);
      } catch (error) {
        console.error("Failed to get Firebase token:", error);
        setToken(undefined);
      }
    };

    getToken();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setToken(undefined);
      } else {
        getToken();
      }
    });

    return () => unsubscribe();
  }, []);

  return { token };
};
