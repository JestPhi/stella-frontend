import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { User } from "react-feather";
import { Menu } from "react-feather";
import style from "./style.module.css";
import MenuProfile from "../MenuProfile";
import MenuEditProfile from "../MenuCreateProfile";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";
import useAuth from "../../hooks/useAuth";
import image from "./image.jpg";
import { getProfile, getStellaIdByFirebaseId } from "../../api";

const ButtonMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firebaseId } = useAuth();
  const { dispatch, state } = useGlobalContext();

  useEffect(() => {
    if (firebaseId) {
      dispatch({
        type: "SET_FIREBASE_ID",
        payload: firebaseId,
      });
    }
  }, [firebaseId]);

  useEffect(() => {
    getStellaIdByFirebaseId(state.firebaseId)
      .then((response) => {
        if (response.stellaId) {
          dispatch({
            type: "SET_STELLA_ID",
            payload: response.stellaId,
          });
          return;
        }
      })
      .catch((error) => {});
  }, [state.firebaseId]);

  useEffect(() => {
    if (state.stellaId) {
      getProfile(state.stellaId).then((profile) => {
        dispatch({
          type: "SET_USERNAME",
          payload: profile.username,
        });
      });
    }
  }, [state.stellaId]);

  return (
    <Button
      onClick={() => {
        if (state.stellaId) {
          dispatch({
            type: "SET_MENU",
            payload: { template: <MenuProfile />, heading: "" },
          });
        }
        if (!state.stellaId) {
          navigate("/signin");
        }
      }}
    >
      {state.username ? state.username : "Sign in"}
      <div className={style.avatar}>
        {!state.stellaId && <User height={20} />}
        {state.stellaId && <img className={style.image} src={image} />}
      </div>
    </Button>
  );
};

export default ButtonMenu;
