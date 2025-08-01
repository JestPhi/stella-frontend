import { Edit2 } from "react-feather";
import Avatar from "../Avatar";
import Button from "../Button";
import Bar from "../Bar";
import style from "./style.module.css";

import { useGlobalContext } from "../../context/context";
import MenuProfileEdit from "../MenuProfileEdit";

const Profile = ({ profileImageKey, bio, username }) => {
  const { dispatch } = useGlobalContext();

  return (
    <div className={style.profile}>
      <Bar className={style.bar} variant="secondary">
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

      <Avatar
        src={
          profileImageKey
            ? `${
                import.meta.env.VITE_STORJ_PUBLIC_URL
              }/${profileImageKey}?wrap=0`
            : undefined
        }
      />
      <div className={style.name}>{username || "Unknown User"}</div>
      <div className={style.bio}>{bio || ""}</div>
    </div>
  );
};

export default Profile;
