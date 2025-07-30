import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import type { UserCredential } from "firebase/auth";
import axios from "axios";

import style from "./style.module.css";
import Button from "../../components/Button";
import useAuth from "../../hooks/useAuth";
import { useGlobalContext } from "../../context/context";
import MenuProfileCreate from "../../components/MenuProfileCreate";

const SignIn = () => {
  const navigate = useNavigate();
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
          `${import.meta.env.VITE_STELLA_APP_HOST}/firebase/${firebaseId}`
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

        navigate("/");
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
    <div className={style.signIn}>
      <span className={style.stella}>Stella</span>
      <span className={style.signInWidth}>Sign in with</span>

      {signInMutation.isError && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          Sign in failed. Please try again.
        </div>
      )}

      <div className={style.signInOptions}>
        <Button
          className={style.signInOption}
          onClick={handleSignIn}
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? "Signing in..." : "Google"}
        </Button>
        <Button className={style.signInOption}>Facebook</Button>
        <Button className={style.signInOption}>Apple</Button>
      </div>
    </div>
  );
};

export default SignIn;
