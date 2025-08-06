"use client";

import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import style from "./style.module.css";
import Avatar from "../Avatar";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";

const MenuProfile = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { dispatch, state } = useGlobalContext();

  return (
    <div className={style.profile}>
      <div className={style.name} style={{ marginTop: "16px" }}>
        {state.username}
      </div>
      <Button
        onClick={() => {
          dispatch({ type: "SET_MENU", payload: null });
          router.push(`/profile/${state.stellaId}`);
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
