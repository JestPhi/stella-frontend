import { useEffect, useState } from "react";

/**
 * Gets Firebase token directly from IndexedDB where Firebase stores auth data.
 * Returns the token when available, or undefined if not found.
 */
export function useFirebaseToken(): string | undefined {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getToken = () => {
      const request = indexedDB.open("firebaseLocalStorageDb");

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(
          ["firebaseLocalStorage"],
          "readonly"
        );
        const store = transaction.objectStore("firebaseLocalStorage");

        store.getAllKeys().onsuccess = (keysEvent) => {
          const keys = (keysEvent.target as IDBRequest).result;
          const authKey = keys.find((key: string) =>
            key.includes("firebase:authUser:")
          );

          if (authKey) {
            store.get(authKey).onsuccess = (getEvent) => {
              const result = (getEvent.target as IDBRequest).result;
              const accessToken = result?.value?.stsTokenManager?.accessToken;

              if (accessToken) {
                setToken(accessToken);
                console.log("[Firebase] Token retrieved from IndexedDB");
              }
            };
          }
        };
      };
    };

    getToken();
    const interval = setInterval(getToken, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return token;
}
