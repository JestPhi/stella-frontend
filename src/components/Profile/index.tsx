import { Link } from "react-feather";
import Avatar from "../Avatar";
import Button from "../Button";
import style from "./style.module.css";

const Profile = () => {
  return (
    <div className={style.profile}>
      <Avatar />
      <div className={style.name}>Benjamin Phi Le</div>
      <Button className={style.meta} variant="contained">
        <span class={style.links}>Links</span> <Link height="12" width="12" />
      </Button>
      <div className={style.bio}>
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum.
      </div>
    </div>
  );
};

export default Profile;
