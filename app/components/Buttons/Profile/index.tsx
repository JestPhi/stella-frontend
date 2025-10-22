"use client";

import { useEffect } from "react";
import { User } from "react-feather";

import { useModalContext } from "@/context/Modal";
import { useGlobalContext } from "../../../context/Global";
import useAuth from "../../../hooks/useAuth";
import { useProfileByFirebaseId } from "../../../hooks/useProfile";
import Button from "../../Button";
import CreateProfile from "../../ModalContent/CreateProfile";
import ProfileContent from "../../ModalContent/Profile";
import SignIn from "../../ModalContent/SignIn";
import styles from "./style.module.css";

const Profile = ({}) => {
  const { dispatch: modalDispatch } = useModalContext();
  const { dispatch, state } = useGlobalContext();
  const { firebaseId, signOut } = useAuth();

  // Only fetch profile when firebaseId exists
  const { data: profileResponse, isSuccess } = useProfileByFirebaseId(
    firebaseId as string
  );

  useEffect(() => {
    if (!isSuccess || !profileResponse) {
      return;
    }

    const profile = profileResponse;

    dispatch({
      type: "SET_PROFILE",
      payload: {
        stellaId: profile.stellaId,
        username: profile.username,
        bio: profile.bio,
        profileImageKey: profile.profileImageKey,
      },
    });
  }, [profileResponse?.stellaId, firebaseId, isSuccess, dispatch]);

  useEffect(() => {
    if (!profileResponse && firebaseId && isSuccess) {
      modalDispatch({
        type: "SHOW_MODAL",
        payload: {
          content: <CreateProfile />,
          height: "400px",
        },
      });
    }
  }, [profileResponse?.stellaId, firebaseId, isSuccess, dispatch]);

  return (
    <>
      {state.stellaId && (
        <Button
          onClick={() => {
            modalDispatch({
              type: "SHOW_MODAL",
              payload: {
                height: `240px`,
                content: <ProfileContent />,
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
            modalDispatch({
              type: "SHOW_MODAL",
              payload: {
                height: `240px`,
                content: <SignIn />,
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
