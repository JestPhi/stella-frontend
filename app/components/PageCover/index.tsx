"use client";

import { useRouter, useParams } from "next/navigation";
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
  const router = useRouter();
  return (
    <div className={style.pageCover}>
      <Bar className={style.topBar} variant="bottom-border">
        <div className={style.profile}>
          <img
            className={style.avatar}
            src={`${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${profileImageKey}?wrap=0`}
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
        onClick={() => {}}
        items={panels}
        stellaId={stellaId}
        storyId={storyId}
        isEditMode={false}
      />
    </div>
  );
};

export default PageCover;
