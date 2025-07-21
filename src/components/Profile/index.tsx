import { useEffect, useState } from "react";
import { Edit2 } from "react-feather";
import { Link } from "react-feather";
import Avatar from "../Avatar";
import Button from "../Button";
import Bar from "../Bar";
import style from "./style.module.css";

import { useGlobalContext } from "../../context/context";
import MenuProfileEdit from "../MenuProfileEdit";

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
                template: <MenuProfileEdit />,
              },
            });
          }}
        >
          <Edit2 height={24} />
        </Button>
      </Bar>
      <Avatar src={state.profileImageSrc} />
      <div className={style.name}>{state.username}</div>
      {/* <Button className={style.meta} variant="fill">
        <span class={style.links}>Links</span> <Link height="12" width="12" />
      </Button> */}
      <div className={style.bio}>{state.bio}</div>
    </div>
  );
};

export default Profile;
