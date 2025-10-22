import Avatar from "@/components/Avatar";
import Bar from "@/components/Bar";
import Button from "@/components/Button";
import EditProfile from "@/components/ModalContent/EditProfile";
import { useGlobalContext } from "@/context/Global";
import { useModalContext } from "@/context/Modal";
import { Edit2 } from "react-feather";
import style from "./style.module.css";

const Profile = () => {
  const {
    state: { bio, username, profileImageKey },
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
          profileImageKey
            ? `${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${profileImageKey}?wrap=0`
            : ""
        }
      />
      <div className={style.name}>{username}</div>
      <div className={style.bio}>{bio || ""}</div>
    </div>
  );
};

export default Profile;
