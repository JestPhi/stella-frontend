import { useEffect } from "react";
import { useNavigate } from "react-router";
import { User } from "react-feather";
import { useQuery } from "@tanstack/react-query";

import { useGlobalContext } from "../../context/context";
import useAuth from "../../hooks/useAuth";
import MenuProfile from "../MenuProfile";
import Button from "../Button";
import style from "./style.module.css";

const ButtonMenu: React.FC = () => {
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
  }, [firebaseId, dispatch]);

  console.log(state.firebaseId);
  const { data } = useQuery({
    queryKey: [state.firebaseId],
    queryFn: () =>
      fetch(
        `${import.meta.env.VITE_STELLA_APP_HOST_URL}/firebase/${firebaseId}`
      ).then((res) => res.json),
  });
  console.log(data);

  useEffect(() => {
    if (!state.firebaseId) return;

    // getProfileByFirebaseId(state.firebaseId)
    //   .then((response) => {
    //     if (response && typeof response !== "object") return;
    //     const doc = response as FirebaseIdDoc | ProfileDoc | null;

    //     if (doc && "stellaId" in doc) {
    //       dispatch({
    //         type: "SET_PROFILE",
    //         payload: doc,
    //       });
    //     }
    //   })
    //   .catch((error: unknown) => {
    //     // TODO error handling
    //   });
  }, [state.firebaseId, dispatch]);

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
      {state.username ? "" : "Sign in"}
      <div
        className={[style.avatar, state.stellaId ? style.signedIn : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <User height={20} color={state.stellaId ? "white" : "black"} />

        {/* {state.stellaId && <img className={style.image} src={image} />} */}
      </div>
    </Button>
  );
};

export default ButtonMenu;
