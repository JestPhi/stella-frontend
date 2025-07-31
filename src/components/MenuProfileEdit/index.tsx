import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  // deleteProfileImage,
  // updateProfileImage,
  updateProfile,
} from "../../api";
import style from "./style.module.css";
import Button from "../Button";
import InputProfileImage from "../InputProfileImage";
import InputText from "../InputText";

import { useGlobalContext } from "../../context/context";

const MenuProfileEdit = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { dispatch, state } = useGlobalContext();
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [disabledUsername, setDisabledUsername] = useState(true);
  const [disabledBio, setDisabledBio] = useState(true);

  // Mutation for ProfileImage upload
  const ProfileImageUploadMutation = useMutation({
    mutationFn: async ({
      stellaId,
      file,
    }: {
      stellaId: string;
      file: File;
    }) => {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("stellaId", stellaId);

      return axios.post(
        `${
          import.meta.env.VITE_STELLA_APP_HOST
        }/profile/${stellaId}/upload-image`,
        formData
      );
    },
    onSuccess: (response) => {
      console.log("ProfileImage uploaded successfully:", response);
      dispatch({
        type: "SET_PROFILE",
        payload: response.data.profile,
      });
      // Refetch profile to get updated profileImageKey
      queryClient.invalidateQueries({ queryKey: ["profile", state.stellaId] });
    },
    onError: (error) => {
      console.error("Failed to upload ProfileImage:", error);
    },
  });

  // Mutation for ProfileImage deletion
  const ProfileImageDeleteMutation = useMutation({
    mutationFn: async ({ stellaId }: { stellaId: string }) => {
      return axios.delete(
        `${import.meta.env.VITE_STELLA_APP_HOST}/profile/${stellaId}/image`
      );
    },
    onSuccess: () => {
      console.log("ProfileImage deleted successfully");

      // Update global state to remove profile image
      dispatch({
        type: "SET_PROFILE",
        payload: {
          profileImageKey: undefined,
        },
      });
    },
    onError: (error) => {
      console.error("Failed to delete ProfileImage:", error);
    },
  });

  // Mutation for profile update
  const bioMutation = useMutation({
    mutationFn: async ({
      bio,
      stellaId,
    }: {
      bio: string;
      stellaId: string;
    }) => {
      return axios.patch(
        `${import.meta.env.VITE_STELLA_APP_HOST}/profile/${stellaId}/bio`,
        { bio }
      );
    },
    onSuccess: () => {
      console.log("Profile updated successfully");

      // Update global state with new values
      dispatch({
        type: "SET_PROFILE",
        payload: {
          bio: bio,
        },
      });

      // Close the menu after successful update
      dispatch({
        type: "SET_MENU",
        payload: null,
      });
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      setDisabledBio(false);
    },
  });

  // Mutation for username update
  const usernameMutation = useMutation({
    mutationFn: async ({
      username,
      stellaId,
    }: {
      username: string;
      stellaId: string;
    }) => {
      return axios.patch(
        `${import.meta.env.VITE_STELLA_APP_HOST}/profile/${stellaId}/username`,
        { username }
      );
    },
    onSuccess: () => {
      console.log("Username updated successfully");

      // Update global state with new username
      dispatch({
        type: "SET_PROFILE",
        payload: {
          username: username,
        },
      });

      // Close the menu after successful update
      dispatch({
        type: "SET_MENU",
        payload: null,
      });
    },
    onError: (error) => {
      console.error("Failed to update username:", error);
      setDisabledUsername(false);
    },
  });

  useEffect(() => {
    setUsername(state.username || "");
  }, [state.username]);

  useEffect(() => {
    setBio(state.bio || "");
  }, [state.bio]);

  const handleProfileImageUpdate = async (file: File) => {
    if (!state.stellaId) {
      console.error("No stellaId found");
      return;
    }

    try {
      // Use the ProfileImage upload mutation
      ProfileImageUploadMutation.mutate({
        stellaId: state.stellaId,
        file,
      });
    } catch (error) {
      console.error("Failed to update ProfileImage:", error);
    }
  };

  const handleProfileImageDelete = async () => {
    // Only proceed if there's a stellaId
    if (!state.stellaId) {
      console.warn("No stellaId found for deletion");
      return;
    }

    // If there's an actual profile image, delete from server
    if (state.profileImageKey) {
      try {
        // Use the ProfileImage delete mutation
        ProfileImageDeleteMutation.mutate({
          stellaId: state.stellaId,
        });
      } catch (error) {
        console.error("Failed to delete ProfileImage:", error);
      }
    } else {
      // If no profile image key, just update local state (for newly selected images)
      dispatch({
        type: "SET_PROFILE",
        payload: {
          profileImageKey: undefined,
        },
      });
    }
  };

  const handleBioUpdate = async () => {
    // Validate required fields
    if (!state.stellaId) {
      console.error("Missing stellaId for bio update");
      return;
    }

    setDisabledBio(true);

    bioMutation.mutate({
      bio: bio,
      stellaId: state.stellaId,
    });
  };

  const handleUsernameUpdate = async () => {
    // Validate required fields
    if (!username.trim() || !state.stellaId) {
      console.error("Missing required fields for username update");
      return;
    }

    setDisabledUsername(true);

    usernameMutation.mutate({
      username: username,
      stellaId: state.stellaId,
    });
  };

  return (
    <div className={style.signUp}>
      {/* Error feedback for mutations */}
      {(ProfileImageUploadMutation.isError ||
        ProfileImageDeleteMutation.isError ||
        bioMutation.isError ||
        usernameMutation.isError) && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          {ProfileImageUploadMutation.isError &&
            "Failed to upload ProfileImage. "}
          {ProfileImageDeleteMutation.isError &&
            "Failed to delete ProfileImage. "}
          {bioMutation.isError && "Failed to update bio. "}
          {usernameMutation.isError && "Failed to update username. "}
          Please try again.
        </div>
      )}
      <InputProfileImage
        imageURL={
          state.profileImageKey
            ? `${import.meta.env.VITE_STORJ_PUBLIC_URL}/${
                state.profileImageKey
              }?wrap=0`
            : null
        }
        onChange={async (value) => {
          if (value) {
            // Convert base64 string to File object
            const response = await fetch(value);
            const blob = await response.blob();
            const file = new File([blob], "profile-image.jpg", {
              type: blob.type,
            });
            handleProfileImageUpdate(file);
          } else {
            handleProfileImageDelete();
          }
        }}
        className={style.ProfileImage}
      />

      {/* Loading indicator for ProfileImage operations */}
      {(ProfileImageUploadMutation.isPending ||
        ProfileImageDeleteMutation.isPending) && (
        <div style={{ textAlign: "center", fontSize: "12px", color: "blue" }}>
          {ProfileImageUploadMutation.isPending && "Uploading ProfileImage..."}
          {ProfileImageDeleteMutation.isPending && "Deleting ProfileImage..."}
        </div>
      )}

      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Username"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setUsername(event.target.value);
          setDisabledUsername(false);
        }}
        value={username}
        disabled={usernameMutation.isPending}
      />
      <Button
        variant={"primary"}
        disabled={disabledUsername || usernameMutation.isPending}
        onClick={handleUsernameUpdate}
      >
        {usernameMutation.isPending ? "Updating..." : "Update Username"}
      </Button>
      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Bio"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setBio(event.target.value);
          setDisabledBio(false);
        }}
        value={bio}
        disabled={bioMutation.isPending}
      />
      <Button
        variant={"primary"}
        disabled={disabledBio || bioMutation.isPending}
        onClick={handleBioUpdate}
      >
        {bioMutation.isPending ? "Updating..." : "Update Bio"}
      </Button>
    </div>
  );
};

export default MenuProfileEdit;
