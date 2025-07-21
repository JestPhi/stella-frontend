import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { postFirebaseId, postUsername } from "../../api";
import style from "./style.module.css";
import Button from "../Button";
import InputAvatar from "../InputAvatar";
import InputText from "../InputText";
import InputTextarea from "../InputTextarea";

import { useGlobalContext } from "../../context/context";

const MenuEditProfile = () => {
  const navigate = useNavigate();
  const [usernameState, setUsernameState] = useState();
  const { dispatch, state } = useGlobalContext();
  console.log(state);
  return (
    <div className={style.signUp}>
      <InputAvatar onChange={() => {}} className={style.avatar} />
      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Username"
        onChange={(event) => {
          setUsernameState(event.target.value);
        }}
        value={state.username}
      />
      <Button
        disabled={!usernameState}
        onClick={async () => {
          const firebaseIdDoc = await postFirebaseId(
            usernameState,
            state.firebaseId
          );
          // Remove menu
          try {
            dispatch({
              type: "SET_MENU",
              payload: null,
            });
          } catch (error) {
            console.log(error);
          }

          // Save username
          await postUsername(state.firebaseId, usernameState);

          try {
            navigate("/");
          } catch (error) {
            console.log(error);
          }
        }}
      >
        {state.username ? "Update Profile" : "Create Profile"}
      </Button>
    </div>
  );
};

export default MenuEditProfile;
