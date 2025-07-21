import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import globalStyle from "../../../src/style.module.css";
import style from "./style.module.css";
import Avatar from "../Avatar";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";

const MenuProfile = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { dispatch, state } = useGlobalContext();

  return (
    <div className={style.profile}>
      <div className={[style.name, globalStyle.mt16].join(" ")}>
        {state.username}
      </div>
      <Button
        onClick={() => {
          dispatch({ type: "SET_MENU", payload: null });
          navigate("/profile/stellaId");
        }}
      >
        View Profile
      </Button>
      <Button
        className={[style.signOut].join(" ")}
        variant="outline"
        onClick={async () => {
          await signOut();
          dispatch({ type: "SET_MENU", payload: null });
          dispatch({ type: "CLEAR_PROFILE" });
        }}
      >
        Sign out
      </Button>
    </div>
  );
};

export default MenuProfile;
