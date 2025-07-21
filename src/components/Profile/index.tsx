import { useEffect, useState } from "react";
import { Edit2 } from "react-feather";
import { Link } from "react-feather";
import Avatar from "../Avatar";
import Button from "../Button";
import Bar from "../Bar";
import style from "./style.module.css";

import { useGlobalContext } from "../../context/context";
import MenuEditProfile from "../MenuCreateProfile";

const Profile = () => {
  const { dispatch, state } = useGlobalContext();

  return (
    <div className={style.profile}>
      <Bar className={style.bar}>
        <Button
          onClick={() => {
            dispatch({
              type: "SET_MENU",
              payload: {
                heading: "Edit Profile",
                template: <MenuEditProfile />,
              },
            });
          }}
        >
          <Edit2 height={24} />
        </Button>
      </Bar>
      <Avatar src={avatarSrc} />
      <div className={style.name}>{state.username}</div>
      {/* <Button className={style.meta} variant="fill">
        <span class={style.links}>Links</span> <Link height="12" width="12" />
      </Button> */}
      <div className={style.bio}>{state.text}</div>
    </div>
  );
};

export default Profile;
