import { useModalContext } from "@/context/Modal";
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
    state: { bio, username, globalImageKey },
  } = useGlobalContext();

  const { dispatch: modalDispatch } = useModalContext();

  return (
    <div className={style.profile}>
      <Bar className={style.bar} variant="secondary">
        <Button
          onClick={() => {
            modalDispatch({
              type: "SHOW_MODAL",
              payload: {
                content: <EditProfile />,
                height: "400px",
              },
            });
          }}
        >
          <Edit2 height={24} />
        </Button>
      </Bar>
      <Avatar
        src={
          globalImageKey
            ? `${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${globalImageKey}?wrap=0`
            : ""
        }
      />
      <div className={style.name}>{username}</div>
      <div className={style.bio}>{bio || ""}</div>
    </div>
  );
};

export default Profile;
