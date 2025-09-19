"use client";

import { useEffect } from "react";
import { User } from "react-feather";

import { useGlobalContext } from "../../../context/Global";
import useAuth from "../../../hooks/useAuth";
import { useProfileByFirebaseId } from "../../../hooks/useProfile";
import Button from "../../Button";
import CreateProfile from "../../ModalContent/CreateProfile";
import ProfileContent from "../../ModalContent/Profile";
import SignIn from "../../ModalContent/SignIn";
import styles from "./style.module.css";

const Profile = ({}) => {
  const { dispatch, state } = useGlobalContext();
  const { firebaseId, signOut } = useAuth();

  const { data: profileResponse, isSuccess } = useProfileByFirebaseId(
    firebaseId || ""
  );

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    dispatch({
      type: "SET_PROFILE",
      payload: profileResponse,
    });
  }, [profileResponse?.stellaId, isSuccess]);

  useEffect(() => {
    if (!profileResponse && firebaseId && isSuccess) {
      dispatch({
        type: "SET_MODAL",
        payload: {
          modalContent: <CreateProfile />,
          modalVisible: true,
          modalHeight: "400px",
        },
      });
    }
  }, [state?.stellaId, firebaseId, isSuccess]);

  return (
    <>
      {state.stellaId && (
        <Button
          onClick={() => {
            dispatch({
              type: "SET_MODAL",
              payload: {
                modalVisible: true,
                modalHeight: `240px`,
                modalContent: <ProfileContent />,
              },
            });
          }}
        >
          <div className={[styles.user, styles.signedIn].join(" ")}>
            <User width={18} />
          </div>
        </Button>
      )}
      {!state.stellaId && (
        <Button
          onClick={() => {
            dispatch({
              type: "SET_MODAL",
              payload: {
                modalVisible: true,
                modalHeight: `240px`,
                modalContent: <SignIn />,
                modalOnClose: signOut,
              },
            });
          }}
        >
          <div className={styles.user}>
            <span className={styles.signIn}>Sign in</span>
            <User width={18} />
          </div>
        </Button>
      )}
    </>
  );
};

export default Profile;
