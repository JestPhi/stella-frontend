import { useAuthContext } from "../../context/auth";
import style from "./style.module.css";
import Button from "../Button";

import { useGlobalContext } from "../../context/context";

const MenuSignUp = () => {
  const { auth, signOut } = useAuthContext();
  const { dispatch } = useGlobalContext();

  return (
    <div className={style.signUp}>
      <Button>Sign Up</Button>
    </div>
  );
};

export default MenuSignUp;
