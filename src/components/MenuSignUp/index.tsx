import { useState } from "react";
import { useAuthContext } from "../../context/auth";
import { setUser } from "../../api";
import style from "./style.module.css";
import Button from "../Button";

import { useGlobalContext } from "../../context/context";

const MenuSignUp = () => {
  const [nameState, setNameState] = useState();
  const { firebaseAuth } = useAuthContext();

  return (
    <div className={style.signUp}>
      <input
        type="text"
        onChange={(event) => {
          setNameState(event.target.value);
        }}
        value={nameState}
      />
      <Button
        onClick={() => {
          setUser(nameState, firebaseAuth.uid);
        }}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default MenuSignUp;
