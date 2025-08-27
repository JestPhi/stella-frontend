"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Bar from "../../components/Bar";
import Button from "../../components/Button";
import InputText from "../../components/InputText";
import { useProfile } from "../../hooks/useProfile";
import { useProfileCreate } from "../../hooks/useProfileMutations";

import style from "./style.module.css";

const EditProfile = () => {
  const { firebaseId } = useParams();

  const [username, setUsername] = useState<string>("");
  const [disabledUsername, setDisabledUsername] = useState(true);

  // TanStack Query for fetching profile data via backend API
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useProfile(firebaseId);

  const profile = profileResponse?.profile;

  // Backend mutation hooks
  const profileCreate = useProfileCreate();

  const handleUsernameUpdate = async () => {
    // Validate required fields
    if (!firebaseId) {
      console.error("Missing stellaId for username update");
      return;
    }

    setDisabledUsername(true);

    profileCreate.mutate(
      {
        firebaseId: firebaseId,
        username: username,
      },
      {
        onSuccess: (response) => {
          console.log("Profile created successfully");
          // Navigate or send message to parent
          parent.postMessage(
            {
              type: "CLOSE_MODAL",
            },
            `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
          );
        },
        onError: (error) => {
          console.error("Failed to create profile:", error);
        },
      }
    );
  };

  return (
    <div className={style.container}>
      <Bar className={style.title}>
        <span>Create a username</span>
      </Bar>
      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Username"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setUsername(event.target.value);
          setDisabledUsername(false);
        }}
        value={username}
        disabled={profileCreate.isPending}
      />
      <Bar className={style.actions}>
        <Button
          variant={"primary"}
          disabled={disabledUsername || profileCreate.isPending}
          onClick={handleUsernameUpdate}
        >
          {profileCreate.isPending ? "Updating..." : "Create Profile"}
        </Button>
      </Bar>
    </div>
  );
};

export default EditProfile;
