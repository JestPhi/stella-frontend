import { Edit2 } from "react-feather";
import Avatar from "../Avatar";
import Button from "../Button";
import Bar from "../Bar";
import style from "./style.module.css";
import { useParams } from "next/navigation";

const Profile = ({ profileImageKey, bio, username }) => {
  const { stellaId } = useParams();
  return (
    <div className={style.profile}>
      <Bar className={style.bar} variant="secondary">
        <Button
          onClick={() => {
            window.parent.postMessage(
              {
                action: "SET_MODAL",
                payload: { pathname: `/edit-profile/${stellaId}`, height: 400 },
              },
              "http://localhost:3015"
            );
          }}
        >
          <Edit2 height={24} />
        </Button>
      </Bar>

      <Avatar
        src={
          profileImageKey
            ? `${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${profileImageKey}?wrap=0`
            : undefined
        }
      />
      <div className={style.name}>{username || "Unknown User"}</div>
      <div className={style.bio}>{bio || ""}</div>
    </div>
  );
};

export default Profile;
