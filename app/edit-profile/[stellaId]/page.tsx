"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Button from "../../components/Button";
import InputProfileImage from "../../components/InputProfileImage";
import InputText from "../../components/InputText";
import { useProfile } from "../../hooks/useProfile";
import {
  useProfileBioUpdate,
  useProfileImageDelete,
  useProfileImageUpload,
  useProfileUsernameUpdate,
} from "../../hooks/useProfileMutations";
import style from "./style.module.css";

const EditProfile = () => {
  const params = useParams();
  const stellaId = params?.stellaId as string;

  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [disabledUsername, setDisabledUsername] = useState(true);
  const [disabledBio, setDisabledBio] = useState(true);

  // TanStack Query for fetching profile data via backend API
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useProfile(stellaId);

  const profile = profileResponse?.profile;

  // Backend mutation hooks
  const profileImageUpload = useProfileImageUpload();
  const profileImageDelete = useProfileImageDelete();
  const profileBioUpdate = useProfileBioUpdate();
  const profileUsernameUpdate = useProfileUsernameUpdate();

  const handleProfileImageUpdate = async (file: File) => {
    console.log("handleProfileImageUpdate called with file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    try {
      // Validate file before upload
      if (!file || file.size === 0) {
        throw new Error("Invalid file: file is empty or undefined");
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        throw new Error("File too large: maximum size is 10MB");
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("profileImage", file, file.name);
      formData.append("stellaId", stellaId);

      // Use the backend API via mutation hook
      profileImageUpload.mutate({
        stellaId: stellaId,
        formData,
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

    try {
      // Use the backend API via mutation hook
      profileImageDelete.mutate(stellaId);
    } catch (error) {
      console.error("Failed to delete ProfileImage:", error);
    }
  };

  const handleBioUpdate = async () => {
    // Validate required fields
    if (!stellaId) {
      console.error("Missing stellaId for bio update");
      return;
    }

    setDisabledBio(true);

    profileBioUpdate.mutate({
      stellaId: stellaId,
      bio: bio,
    });
  };

  const handleUsernameUpdate = async () => {
    // Validate required fields
    if (!stellaId) {
      console.error("Missing stellaId for username update");
      return;
    }

    setDisabledUsername(true);

    profileUsernameUpdate.mutate({
      stellaId: stellaId,
      username: username,
    });
  };

  return (
    <div className={style.signUp}>
      {/* Error feedback for mutations */}
      {(profileImageUpload.isError ||
        profileImageDelete.isError ||
        profileBioUpdate.isError ||
        profileUsernameUpdate.isError) && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          {profileImageUpload.isError && "Failed to upload ProfileImage. "}
          {profileImageDelete.isError && "Failed to delete ProfileImage. "}
          {profileBioUpdate.isError && "Failed to update bio. "}
          {profileUsernameUpdate.isError && "Failed to update username. "}
          Please try again.
        </div>
      )}
      <InputProfileImage
        imageURL={
          profile?.profileImageKey
            ? `${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${profile?.profileImageKey}?wrap=0`
            : null
        }
        onChange={async (file) => {
          if (file) {
            // File object is passed directly, no need for conversion
            handleProfileImageUpdate(file);
          } else {
            handleProfileImageDelete();
          }
        }}
        className={style.ProfileImage}
      />

      {/* Loading indicator for ProfileImage operations */}
      {(profileImageUpload.isPending || profileImageDelete.isPending) && (
        <div style={{ textAlign: "center", fontSize: "12px", color: "blue" }}>
          {profileImageUpload.isPending && "Uploading ProfileImage..."}
          {profileImageDelete.isPending && "Deleting ProfileImage..."}
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
        disabled={profileUsernameUpdate.isPending}
      />
      <Button
        variant={"primary"}
        disabled={disabledUsername || profileUsernameUpdate.isPending}
        onClick={handleUsernameUpdate}
      >
        {profileUsernameUpdate.isPending ? "Updating..." : "Update Username"}
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
        disabled={profileBioUpdate.isPending}
      />
      <Button
        variant={"primary"}
        disabled={disabledBio || profileBioUpdate.isPending}
        onClick={handleBioUpdate}
      >
        {profileBioUpdate.isPending ? "Updating..." : "Update Bio"}
      </Button>
    </div>
  );
};

export default EditProfile;
