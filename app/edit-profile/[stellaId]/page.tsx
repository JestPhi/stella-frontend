"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  // deleteProfileImage,
  // updateProfileImage,
  updateProfile,
} from "../../../src/api";
import style from "./style.module.css";
import Button from "../../../src/components/Button";
import InputProfileImage from "../../../src/components/InputProfileImage";
import InputText from "../../../src/components/InputText";

const EditProfile = () => {
  const { stellaId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

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
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profile/${stellaId}/upload-image`,
        formData
      );
    },
    onSuccess: (response) => {
      // Refetch profile to get updated profileImageKey
      queryClient.invalidateQueries({ queryKey: ["profile", stellaId] });
    },
    onError: (error) => {
      console.error("Failed to upload ProfileImage:", error);
    },
  });

  // Mutation for ProfileImage deletion
  const ProfileImageDeleteMutation = useMutation({
    mutationFn: async ({ stellaId }: { stellaId: string }) => {
      return axios.delete(
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profile/${stellaId}/image`
      );
    },
    onSuccess: () => {
      console.log("ProfileImage deleted successfully");
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
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profile/${stellaId}/bio`,
        { bio }
      );
    },
    onSuccess: () => {
      console.log("Profile updated successfully");

      // Update global state with new values
      //   dispatch({
      //     type: "SET_PROFILE",
      //     payload: {
      //       bio: bio,
      //     },
      //   });
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
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profile/${stellaId}/username`,
        { username }
      );
    },
    onSuccess: () => {
      console.log("Username updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update username:", error);
      setDisabledUsername(false);
    },
  });

  const handleProfileImageUpdate = async (file: File) => {
    try {
      // Use the ProfileImage upload mutation
      ProfileImageUploadMutation.mutate({
        stellaId: stellaId,
        file,
      });
    } catch (error) {
      console.error("Failed to update ProfileImage:", error);
    }
  };

  const handleProfileImageDelete = async () => {
    // Only proceed if there's a stellaId
    if (!stellaId) {
      console.warn("No stellaId found for deletion");
      return;
    }

    // If there's an actual profile image, delete from server
    // if (profileImageKey) {
    //   try {
    //     // Use the ProfileImage delete mutation
    //     ProfileImageDeleteMutation.mutate({
    //       stellaId: stellaId,
    //     });
    //   } catch (error) {
    //     console.error("Failed to delete ProfileImage:", error);
    //   }
    // } else {
    //   // If no profile image key, just update local state (for newly selected images)
    //   dispatch({
    //     type: "SET_PROFILE",
    //     payload: {
    //       profileImageKey: undefined,
    //     },
    //   });
    // }
  };

  const handleBioUpdate = async () => {
    // Validate required fields
    if (!stellaId) {
      console.error("Missing stellaId for bio update");
      return;
    }

    setDisabledBio(true);

    bioMutation.mutate({
      bio: bio,
      stellaId: stellaId,
    });
  };

  const handleUsernameUpdate = async () => {
    // Validate required fields
    if (!username.trim() || !stellaId) {
      console.error("Missing required fields for username update");
      return;
    }

    setDisabledUsername(true);

    usernameMutation.mutate({
      username: username,
      stellaId: stellaId,
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
      {/* <InputProfileImage
        imageURL={
          state.profileImageKey
            ? `${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${state.profileImageKey}?wrap=0`
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
      /> */}

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

export default EditProfile;
