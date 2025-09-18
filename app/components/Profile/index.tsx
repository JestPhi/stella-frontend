import { Edit2 } from "react-feather";
import { useGlobalContext } from "../../context/Global";
import Avatar from "../Avatar";
import Bar from "../Bar";
import Button from "../Button";
import EditProfile from "../ModalContent/EditProfile";
import style from "./style.module.css";

const Profile = () => {
  const {
    dispatch,
    state: { stellaId, bio, username, profileImageKey },
  } = useGlobalContext();

  return (
    <div className={style.profile}>
      <Bar className={style.bar} variant="secondary">
        <Button
          onClick={() => {
            dispatch({
              type: "SET_MODAL",
              payload: {
                modalVisible: true,
                modalContent: <EditProfile />,
                modalHeight: "400px",
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
