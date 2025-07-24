import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Edit2 } from "react-feather";
import Avatar from "../Avatar";
import Button from "../Button";
import Bar from "../Bar";
import style from "./style.module.css";
import { getProfile } from "../../api";

import { useGlobalContext } from "../../context/context";
import MenuProfileEdit from "../MenuProfileEdit";

const Profile = () => {
  const { dispatch, state } = useGlobalContext();
  const { stellaId } = useParams<{ stellaId: string }>();
  const [profileState, setProfileState] = useState({});

  useEffect(() => {
    if (stellaId) {
      getProfile(stellaId).then((profile) => {
        setProfileState(profile);
      });
      // Use the stellaId from URL parameter
      console.log("Profile stellaId from URL:", stellaId);
      // You can dispatch an action to set the stellaId in global state
    }
  }, [stellaId]);
  console.log(profileState);
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
      <Avatar
        src={`https://link.storjshare.io/s/jukiguk32p4ahoxnsuuunt7z5wyq/stella/${profileState.stellaId}/profile/${profileState.profileImage}?wrap=0`}
      />
      <div className={style.name}>{profileState.username}</div>
      {/* <Button className={style.meta} variant="fill">
        <span class={style.links}>Links</span> <Link height="12" width="12" />
      </Button> */}
      <div className={style.bio}>{profileState.bio}</div>
    </div>
  );
};

export default Profile;
