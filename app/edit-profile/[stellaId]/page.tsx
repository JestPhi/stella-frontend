"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import Button from "../../components/Button";
import InputProfileImage from "../../components/InputProfileImage";
import InputText from "../../components/InputText";
import style from "./style.module.css";

const EditProfile = () => {
  const { stellaId } = useParams();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [disabledUsername, setDisabledUsername] = useState(true);
  const [disabledBio, setDisabledBio] = useState(true);

  // TanStack Query for fetching profile data by stellaId
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useQuery({
    queryKey: ["profile", stellaId],
    queryFn: () => {
      return axios(
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}`
      ).then((response) => {
        return response.data.profile;
      });
    },
    enabled: !!stellaId,
  });

  // Mutation for ProfileImage upload
  const ProfileImageUploadMutation = useMutation({
    mutationFn: async ({
      stellaId,
      file,
    }: {
      stellaId: string;
      file: File;
    }) => {
      console.log("Starting FormData upload for:", {
        stellaId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      // Create FormData for file upload
      const formData = new FormData();

      // Validate file before adding to FormData
      if (!file || file.size === 0) {
        throw new Error("Invalid file: file is empty or undefined");
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        throw new Error("File too large: maximum size is 10MB");
      }

    

      formData.append("profileImage", file, file.name);
      formData.append("stellaId", stellaId);

      // Debug FormData contents
      console.log(
        "FormData created with profileImage file and stellaId:",
        stellaId
      );

      return fetch(
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}/images`,
        {
          method: "POST",
          body: formData,
        }
      ).then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`HTTP ${response.status}: ${text}`);
          });
        }
        return response.json();
      });
    },
    onSuccess: (response) => {
      console.log("ProfileImage uploaded successfully:", response);
      // Refetch profile to get updated profileImageKey
      queryClient.invalidateQueries({ queryKey: ["profile", stellaId] });
    },
    onError: (error: any) => {
      console.error("Failed to upload ProfileImage:", error);
      console.error("Error message:", error.message);
    },
  });

  // Mutation for ProfileImage deletion
  const ProfileImageDeleteMutation = useMutation({
    mutationFn: async ({ stellaId }: { stellaId: string }) => {
      return axios.delete(
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}/images`
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
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}/bio`,
        { bio }
      );
    },
    onSuccess: () => {
      console.log("Profile updated successfully");
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
        `${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/profiles/${stellaId}/username`,
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
    console.log("handleProfileImageUpdate called with file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

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

  console.log(profile);

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
