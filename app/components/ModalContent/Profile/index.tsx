import Bar from "@/components/Bar";
import ModalClose from "@/components/Buttons/ModalClose";
import { useGlobalContext } from "@/context/Global";
import { useModalContext } from "@/context/Modal";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { LogOut, User } from "react-feather";
import styles from "./style.module.css";

const Profile = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { dispatch, state } = useGlobalContext();
  const { dispatch: modalDispatch } = useModalContext();

  return (
    <div>
      <Bar>
        <ModalClose />
      </Bar>
      <div className={styles.container}>
        <button
          className={styles.button}
          onClick={() => {
            router.push(`/profile/${state.stellaId}`);
            modalDispatch({ type: "HIDE_MODAL" });
          }}
        >
          <div className={styles.innerButton}>
            <User />
          </div>
          View Profile
        </button>
        <button
          className={styles.button}
          onClick={() => {
            signOut();
            modalDispatch({
              type: "HIDE_MODAL",
            });
            dispatch({
              type: "CLEAR_STATE",
            });
          }}
        >
          <div className={styles.innerButton}>
            <LogOut />
          </div>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
