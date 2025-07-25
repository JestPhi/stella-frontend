import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { updateProfile } from "../../api";
import style from "./style.module.css";
import Button from "../Button";
import InputAvatar from "../InputAvatar";
import InputText from "../InputText";

import InputTextarea from "../InputTextarea";

import { useGlobalContext } from "../../context/context";

const MenuCreateProfile = () => {
  const navigate = useNavigate();
  const { dispatch, state } = useGlobalContext();
  const [usernameState, setUsernameState] = useState();
  const [bioState, setBioState] = useState();
  const [imageBlobState, setImageBlobState] = useState();
  const [disabledState, setDisabledState] = useState(true);

  useEffect(() => {
    setUsernameState(state.username);
  }, [state.username]);

  useEffect(() => {
    setBioState(state.bio);
  }, [state.bioState]);

  return (
    <div className={style.signUp}>
      <InputAvatar
        imageURL={`${import.meta.env.VITE_STORJ_PUBLIC_URL}/${
          state.stellaId
        }/profile/${state.profileImageURL}?wrap=0`}
        onChange={(value) => {
          setImageBlobState(value);
          setDisabledState(false);
        }}
        className={style.avatar}
      />
      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Username"
        onChange={(event) => {
          setUsernameState(event.target.value);
          setDisabledState(false);
        }}
        value={usernameState}
      />
      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Bio"
        onChange={(event) => {
          setBioState(event.target.value);
          setDisabledState(false);
        }}
        value={bioState}
      />
      <Button
        variant={"primary"}
        disabled={disabledState}
        onClick={async () => {
          // Update Profile

          setDisabledState(true);
          await updateProfile({
            bio: bioState,
            originalProfileImageURL: state.profileImageURL,
            imageBlob: imageBlobState,
            username: usernameState,
            stellaId: state.stellaId,
          });

          try {
            dispatch({
              type: "SET_MENU",
              payload: null,
            });
            dispatch({
              type: "SET_PROFILE",
              payload: { username: usernameState, bio: bioState },
            });
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Update Profile
      </Button>
    </div>
  );
};

export default MenuCreateProfile;
