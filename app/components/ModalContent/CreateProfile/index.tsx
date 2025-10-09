"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGlobalContext } from "../../../context/Global";
import useAuth from "../../../hooks/useAuth";
import { useProfileCreate } from "../../../hooks/useProfileMutations";
import Bar from "../../Bar";
import Button from "../../ButtonWrapper";
import InputText from "../../InputText";
import style from "./style.module.css";

const CreateProfile = () => {
  const { firebaseId } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [disabledUsername, setDisabledUsername] = useState(true);
  const router = useRouter();

  // TanStack Query for fetching profile data via backend API

  const { state, dispatch } = useGlobalContext();

  // Backend mutation hooks
  const profileCreate = useProfileCreate();

  const handleUsernameUpdate = async () => {
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
          dispatch({
            type: "HIDE_MODAL",
          });
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
        <button
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
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

export default CreateProfile;
