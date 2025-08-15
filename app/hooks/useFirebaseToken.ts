/**
 * Returns a promise that resolves when the Firebase token is available.
 * Useful for waiting for the token before making API calls.
 */
export function waitForFirebaseToken(): Promise<string> {
  return new Promise((resolve) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "FIREBASE_TOKEN_RESPONSE") {
        window.removeEventListener("message", handleMessage);
        resolve(event.data.token);
      }
    };

    window.addEventListener("message", handleMessage);

    // Request token from parent
    window.parent.postMessage(
      { type: "REQUEST_FIREBASE_TOKEN" },
      "http://localhost:3015"
    );
  });
}
