import { useEffect } from "react";
import { useNavigate } from "react-router";
import { User } from "react-feather";
import { useQuery } from "@tanstack/react-query";

import { useGlobalContext } from "../../context/context";
import useAuth from "../../hooks/useAuth";
import MenuProfile from "../MenuProfile";
import Button from "../Button";
import style from "./style.module.css";

const ButtonMenu: React.FC = () => {
  const navigate = useNavigate();
  const { firebaseId } = useAuth();
  const { dispatch, state } = useGlobalContext();

  useEffect(() => {
    if (firebaseId) {
      dispatch({
        type: "SET_FIREBASE_ID",
        payload: firebaseId,
      });
    }
  }, [firebaseId, dispatch]);

  // TanStack Query to fetch profile by Firebase ID
  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profileByFirebaseId", state.firebaseId],
    queryFn: async () => {
      if (!state.firebaseId) throw new Error("No Firebase ID");

      const response = await fetch(
        `${import.meta.env.VITE_STELLA_APP_HOST}/firebase/${state.firebaseId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile API response:", data);

      // Return the actual profile data, not the raw response
      return data.profile || data;
    },
    enabled: !!state.firebaseId, // Only run when Firebase ID exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  // Update global state when profile data is loaded
  useEffect(() => {
    if (profileData && !isLoading && !isError) {
      dispatch({
        type: "SET_PROFILE",
        payload: profileData,
      });
    }
  }, [profileData, isLoading, isError, dispatch]);

  return (
    <>
      {/* Error Display (optional - can be removed if you don't want visible errors) */}
      {isError && (
        <div style={{ color: "red", fontSize: "12px", marginBottom: "5px" }}>
          Failed to load profile: {error?.message}
        </div>
      )}

      <Button
        onClick={() => {
          if (state.stellaId) {
            dispatch({
              type: "SET_MENU",
              payload: { template: <MenuProfile />, heading: "" },
            });
          }
          if (!state.stellaId) {
            navigate("/signin");
          }
        }}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? "Loading..." : state.username ? "" : "Sign in"}
        <div
          className={[style.avatar, state.stellaId ? style.signedIn : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <User height={20} color={state.stellaId ? "white" : "black"} />

          {/* {state.stellaId && <img className={style.image} src={image} />} */}
        </div>
      </Button>
    </>
  );
};

export default ButtonMenu;
