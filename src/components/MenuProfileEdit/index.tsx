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

  useEffect(() => {
    setUsernameState(state.username);
  }, [state.username]);

  useEffect(() => {
    setBioState(state.bio);
  }, [state.bioState]);

  return (
    <div className={style.signUp}>
      <InputAvatar
        onChange={(value) => {
          setImageBlobState(value);
        }}
        className={style.avatar}
      />
      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Username"
        onChange={(event) => {
          setUsernameState(event.target.value);
        }}
        value={usernameState}
      />
      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Bio"
        onChange={(event) => {
          setBioState(event.target.value);
        }}
        value={bioState}
      />
      <Button
        variant={"primary"}
        disabled={!usernameState}
        onClick={async () => {
          // Update Profile
          await updateProfile({
            bio: bioState,
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
