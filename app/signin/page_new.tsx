"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import type { UserCredential } from "firebase/auth";
import axios from "axios";

import Button from "../../src/components/Button";
import useAuth from "../../src/hooks/useAuth";
import { useGlobalContext } from "../../src/context/context";
import MenuProfileCreate from "../../src/components/MenuProfileCreate";

// Inline styles to replace the imported CSS
const signInStyles = {
  signIn: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  signInOptions: {
    background: "whitesmoke",
    padding: "12px 16px",
    width: "100%",
  },
  signInOption: {
    background: "white",
    margin: "4px 0",
    width: "100%",
  },
  signInWidth: {
    fontWeight: 600,
    marginBottom: "16px",
  },
  stella: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
};

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { dispatch } = useGlobalContext();

  // Mutation for the complete sign-in flow
  const signInMutation = useMutation({
    mutationFn: async (): Promise<{
      firebaseId: string;
      profileData?: any;
    }> => {
      const profile = (await signIn()) as UserCredential;
      const firebaseId = profile.user.uid;

      try {
        const response = await axios(
          `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/firebase/${firebaseId}`
        );
        return { firebaseId, profileData: response.data };
      } catch (error) {
        return { firebaseId };
      }
    },
    onSuccess: ({ firebaseId, profileData }) => {
      if (profileData) {
        // Existing user - set profile and navigate home
        dispatch({
          type: "SET_PROFILE",
          payload: profileData.profile,
        });

        dispatch({
          type: "SET_MENU",
          payload: null,
        });

        router.push("/");
      } else {
        dispatch({
          type: "SET_MENU",
          payload: {
            heading: "Create Username",
            template: <MenuProfileCreate firebaseId={firebaseId} />,
          },
        });
      }
    },
    onError: (error) => {
      console.error("Sign in failed:", error);
    },
    retry: 1,
  });

  const handleSignIn = () => {
    signInMutation.mutate();
  };

  return (
    <div style={signInStyles.signIn}>
      <span style={signInStyles.stella}>Stella</span>
      <span style={signInStyles.signInWidth}>Sign in with</span>

      {signInMutation.isError && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          Sign in failed. Please try again.
        </div>
      )}

      <div style={signInStyles.signInOptions}>
        <Button
          style={signInStyles.signInOption}
          onClick={handleSignIn}
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? "Signing in..." : "Google"}
        </Button>
        <Button style={signInStyles.signInOption}>Facebook</Button>
        <Button style={signInStyles.signInOption}>Apple</Button>
      </div>
    </div>
  );
}
