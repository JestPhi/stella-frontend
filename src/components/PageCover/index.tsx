import { useNavigate, useParams } from "react-router";
import style from "./style.module.css";
import Bar from "../Bar";
import ButtonPageMore from "../ButtonPageMore";
import Panels from "../Panels";

const PageCover = ({ image, panels, storyId, stellaId }) => {
  const navigate = useNavigate();
  console.log(panels);
  return (
    <div
      className={style.pageCover}
      onClick={() => {
        navigate(`/profile/${stellaId}/${storyId}`);
      }}
    >
      <Bar className={style.topBar} variant="bottom-border">
        <div className={style.profile}>
          <img
            className={style.avatar}
            src={`${
              import.meta.env.VITE_STORJ_PUBLIC_URL
            }/${stellaId}/stories/${storyId}/${image}?wrap=0`}
          />{" "}
          Phi Le
        </div>
        <div className={style.actions}>
          <ButtonPageMore
            isCoverPage={true}
            heading="cover"
            stellaId={stellaId}
            storyId={storyId}
          />
        </div>
      </Bar>
      <Panels
        items={panels}
        stellaId={stellaId}
        storyId={storyId}
        isEditMode={false}
      />
    </div>
  );
};

export default PageCover;
