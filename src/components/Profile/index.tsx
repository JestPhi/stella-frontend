import axios from "axios";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Edit2 } from "react-feather";
import Avatar from "../Avatar";
import Button from "../Button";
import Bar from "../Bar";
import style from "./style.module.css";

import { useGlobalContext } from "../../context/context";
import MenuProfileEdit from "../MenuProfileEdit";

const Profile = () => {
  const { dispatch, state } = useGlobalContext();
  const { stellaId } = useParams<{ stellaId: string }>();

  // TanStack Query to fetch profile data (CORRECT approach)
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile", stellaId],
    queryFn: async () => {
      if (!stellaId) throw new Error("No stellaId provided");

      const response = await axios.get(
        `${import.meta.env.VITE_STELLA_APP_HOST}/profile/${stellaId}`
      );
      console.log("Profile API response:", response.data);

      // Handle different possible response structures
      return response.data.profile || response.data;
    },
    enabled: !!stellaId, // Only run when stellaId exists
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  // Refetch when global state profile-related fields change
  useEffect(() => {
    if (stellaId && (state.username || state.bio || state.profileImageKey)) {
      console.log("Global state changed, refetching profile data");
      refetch();
    }
  }, [state.username, state.bio, state.profileImageKey, stellaId, refetch]);

  return (
    <div className={style.profile}>
      <Bar className={style.bar} variant="secondary">
        <Button
          onClick={() => {
            dispatch({
              type: "SET_MENU",
              payload: {
                heading: "Edit Profile",
                template: <MenuProfileEdit />,
              },
            });
          }}
        >
          <Edit2 height={24} />
        </Button>
      </Bar>

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading profile...
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          <div style={{ marginBottom: "10px" }}>
            Failed to load profile: {error?.message || "Unknown error"}
          </div>
          <Button
            variant="secondary"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? "Retrying..." : "Try Again"}
          </Button>
        </div>
      )}

      {/* Profile Content */}
      {profile && (
        <>
          <Avatar
            src={
              profile.profileImageKey
                ? `${import.meta.env.VITE_STORJ_PUBLIC_URL}/${
                    profile.profileImageKey
                  }?wrap=0`
                : undefined
            }
          />
          <div className={style.name}>{profile.username || "Unknown User"}</div>
          <div className={style.bio}>{profile.bio || ""}</div>
        </>
      )}
    </div>
  );
};

export default Profile;
