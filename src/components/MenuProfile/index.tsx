import { useAuthContext } from "../../context/auth";
import globalStyle from "../../../src/style.module.css";
import style from "./style.module.css";
import Avatar from "../Avatar";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";

const MenuProfile = () => {
  const { auth, signOut } = useAuthContext();
  const { dispatch } = useGlobalContext();

  return (
    <div className={style.profile}>
      <Avatar />
      <div className={[style.name, globalStyle.mt16].join(" ")}>
        {auth?.displayName}
      </div>
      <Button>View Profile</Button>
      <Button
        className={[style.signOut].join(" ")}
        variant="outline"
        onClick={() => {
          signOut();
          dispatch({ type: "SET_MENU", payload: null });
        }}
      >
        Sign out
      </Button>
    </div>
  );
};

export default MenuProfile;
