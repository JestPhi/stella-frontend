import { useNavigate, useParams } from "react-router";
import style from "./style.module.css";
import Bar from "../Bar";
import ButtonPageMore from "../ButtonPageMore";
import Panels from "../Panels";

const PageCover = ({
  panels,
  profileImageKey,
  onChange,
  onDelete,
  username,
  storyId,
  stellaId,
}) => {
  const navigate = useNavigate();
  return (
    <div className={style.pageCover}>
      <Bar className={style.topBar} variant="bottom-border">
        <div className={style.profile}>
          <img
            className={style.avatar}
            src={`${
              import.meta.env.VITE_STORJ_PUBLIC_URL
            }/${profileImageKey}?wrap=0`}
          />{" "}
          {username}
        </div>
        <div className={style.actions}>
          <ButtonPageMore
            onChange={onChange}
            onDelete={onDelete}
            page="coverPage"
            isCoverPage={true}
            stellaId={stellaId}
            storyId={storyId}
          />
        </div>
      </Bar>
      <Panels
        className={style.pageCoverPanel}
        onClick={() => {
          navigate(`/profile/${stellaId}/${storyId}`);
        }}
        items={panels}
        stellaId={stellaId}
        storyId={storyId}
        isEditMode={false}
      />
    </div>
  );
};

export default PageCover;
