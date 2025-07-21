import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { createProfile } from "../../api";
import Button from "../Button";
import InputAvatar from "../InputAvatar";
import InputText from "../InputText";

import style from "./style.module.css";

import { useGlobalContext } from "../../context/context";

const MenuCreateProfile = () => {
  const navigate = useNavigate();
  const { dispatch, state } = useGlobalContext();
  const [usernameState, setUsernameState] = useState<string | undefined>("");

  useEffect(() => {
    setUsernameState(state.username);
  }, [state.username]);

  return (
    <div className={style.signUp}>
      <InputAvatar onChange={() => {}} className={style.avatar} />
      <InputText
        className={style.inputText}
        type="text"
        placeholder="Enter Username"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setUsernameState(event.target.value);
        }}
        value={usernameState}
      />
      <Button
        variant={"primary"}
        disabled={!usernameState}
        onClick={async () => {
          // Create Profile
          const profileDoc = await createProfile({
            username: usernameState,
            firebaseId: state.firebaseId,
          });

          try {
            // Remove menu
            dispatch({
              type: "SET_MENU",
              payload: null,
            });

            // Update global state and navigate
            dispatch({
              type: "SET_PROFILE",
              payload: profileDoc,
            });

            navigate("/");
          } catch (error) {
            console.error("Error creating profile:", error);
          }
        }}
      >
        Create Profile
      </Button>
    </div>
  );
};

export default MenuCreateProfile;
