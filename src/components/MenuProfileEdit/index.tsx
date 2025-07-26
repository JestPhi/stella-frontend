import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  deleteAvatar,
  deleteObject,
  updateAvatar,
  updateProfile,
} from "../../api";
import style from "./style.module.css";
import Button from "../Button";
import InputAvatar from "../InputAvatar";
import InputText from "../InputText";

import { useGlobalContext } from "../../context/context";

const MenuCreateProfile = () => {
  const navigate = useNavigate();
  const { dispatch, state } = useGlobalContext();
  const [usernameState, setUsernameState] = useState<string>("");
  const [bioState, setBioState] = useState<string>("");
  const [disabledState, setDisabledState] = useState(true);

  useEffect(() => {
    setUsernameState(state.username || "");
  }, [state.username]);

  useEffect(() => {
    setBioState(state.bio || "");
  }, [state.bio]);

  const handleAvatarUpdate = async (imageBlob: string) => {
    try {
      // Then update the profile with the new image URL
      const doc = await updateAvatar(state.stellaId, imageBlob);

      dispatch({
        type: "SET_PROFILE",
        payload: {
          profileImageURL: doc.profileImageURL,
        },
      });
    } catch (error) {
      console.error("Failed to update avatar:", error);
      // Could add user-facing error handling here (e.g., toast notification)
    }
  };

  const handleAvatarDelete = async () => {
    // Only proceed if there's an image to delete
    if (!state.profileImageURL) {
      console.warn("No profile image to delete");
      return;
    }

    const imageKey = `${state.stellaId}/profile/${state.profileImageURL}`;

    try {
      // First delete the image from storage
      await deleteAvatar(state.stellaId, imageKey);

      dispatch({
        type: "SET_PROFILE",
        payload: {
          profileImageURL: null,
        },
      });

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to delete avatar:", error);
      // If deletion fails, we should not update the profile
      // to maintain data consistency
    }
  };

  const handleUpdateProfile = async () => {
    // Validate required fields
    if (!usernameState.trim() || !state.stellaId) {
      console.error("Missing required fields for profile update");
      return;
    }

    setDisabledState(true);

    try {
      // Update the profile with current form data
      await updateProfile({
        bio: bioState,
        profileImageURL: state.profileImageURL,
        username: usernameState,
        stellaId: state.stellaId,
      });

      // Update global state with new values
      dispatch({
        type: "SET_PROFILE",
        payload: {
          username: usernameState,
          bio: bioState,
        },
      });

      // Close the menu after successful update
      dispatch({
        type: "SET_MENU",
        payload: null,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Re-enable the button if update fails
      setDisabledState(false);
      // Could add user-facing error handling here (e.g., toast notification)
    }
  };

  return (
    <div className={style.signUp}>
      <InputAvatar
        imageURL={`${import.meta.env.VITE_STORJ_PUBLIC_URL}/${
          state.stellaId
        }/profile/${state.profileImageURL}?wrap=0`}
        onChange={async (value) => {
          if (value) {
            handleAvatarUpdate(value);
          } else {
            handleAvatarDelete();
          }
        }}
        className={style.avatar}
      />
      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Username"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setUsernameState(event.target.value);
          setDisabledState(false);
        }}
        value={usernameState}
      />
      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Bio"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setBioState(event.target.value);
          setDisabledState(false);
        }}
        value={bioState}
      />
      <Button
        variant={"primary"}
        disabled={disabledState}
        onClick={handleUpdateProfile}
      >
        Update Profile
      </Button>
    </div>
  );
};

export default MenuCreateProfile;
