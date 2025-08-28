"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

  const { data: profileResponse } = useProfile(stellaId);
  const profile = profileResponse?.profile;

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: { username: "", bio: "" },
  });

  // Mutation hooks
  const profileImageUpload = useProfileImageUpload();
  const profileImageDelete = useProfileImageDelete();
  const profileBioUpdate = useProfileBioUpdate();
  const profileUsernameUpdate = useProfileUsernameUpdate();

  // Reset form when profile loads
  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username ?? "",
        bio: profile.bio ?? "",
      });
    }
  }, [profile, reset]);

  // Handle successful updates
  useEffect(() => {
    if (profileBioUpdate.isSuccess || profileUsernameUpdate.isSuccess) {
      parent.postMessage(
        {
          type: "SET_LAYOUT",
          payload: {
            basePathname: `/profile/${stellaId}?update=${Date.now()}`,
            modalVisible: false,
          },
        },
        `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
      );
    }
  }, [profileBioUpdate.isSuccess, profileUsernameUpdate.isSuccess]);

  const handleImageChange = (file: File | null) => {
    if (!stellaId) return;

    if (file) {
      if (file.size > 10 * 1024 * 1024) return; // 10MB limit

      const formData = new FormData();
      formData.append("profileImage", file, file.name);
      formData.append("stellaId", stellaId);
      profileImageUpload.mutate({ stellaId, formData });
    } else {
      profileImageDelete.mutate(stellaId);
    }
  };

  const onProfileSubmit = (data: { username: string; bio: string }) => {
    if (formState.dirtyFields.username) {
      profileUsernameUpdate.mutate({ stellaId, username: data.username });
    }
    if (formState.dirtyFields.bio) {
      profileBioUpdate.mutate({ stellaId, bio: data.bio });
    }
  };

  // Computed state
  const hasErrors = [
    profileImageUpload,
    profileImageDelete,
    profileBioUpdate,
    profileUsernameUpdate,
  ].some((mutation) => mutation.isError);
  const isImageLoading =
    profileImageUpload.isPending || profileImageDelete.isPending;
  const isProfileLoading =
    profileUsernameUpdate.isPending || profileBioUpdate.isPending;
  const hasChanges =
    formState.dirtyFields.username || formState.dirtyFields.bio;

  return (
    <form className={style.signUp}>
      {/* Error feedback */}
      {hasErrors && (
        <div
          style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
        >
          Failed to update profile. Please try again.
        </div>
      )}

      <InputProfileImage
        imageURL={
          profile?.profileImageKey
            ? `${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${profile?.profileImageKey}?wrap=0`
            : null
        }
        onChange={handleImageChange}
        className={style.ProfileImage}
      />

      {/* Image loading indicator */}
      {isImageLoading && (
        <div style={{ textAlign: "center", fontSize: "12px", color: "blue" }}>
          {profileImageUpload.isPending ? "Uploading..." : "Deleting..."}
        </div>
      )}

      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Username"
        {...register("username")}
        disabled={isProfileLoading}
      />

      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Bio"
        {...register("bio")}
        disabled={isProfileLoading}
      />

      <Button
        variant={"primary"}
        disabled={!hasChanges || isProfileLoading}
        onClick={handleSubmit(onProfileSubmit)}
        type="button"
      >
        {isProfileLoading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
};

export default EditProfile;
