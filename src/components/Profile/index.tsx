import { useEffect, useState } from "react";
import { Link } from "react-feather";
import Avatar from "../Avatar";
import Button from "../Button";
import style from "./style.module.css";
import { useAuthContext } from "../../context/auth";

const Profile = () => {
  const { avatarSrc, name, text } = useAuthContext();

  return (
    <div className={style.profile}>
      <Avatar src={avatarSrc} />
      <div className={style.name}>{name}</div>
      {/* <Button className={style.meta} variant="contained">
        <span class={style.links}>Links</span> <Link height="12" width="12" />
      </Button> */}
      <div className={style.bio}>{text}</div>
    </div>
  );
};

export default Profile;
