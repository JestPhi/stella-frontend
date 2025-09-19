"use client";

import Bar from "../Bar";
import PageMore from "../Buttons/PageMore";
import Panels from "../Panels";
import style from "./style.module.css";

const PageCover = ({ panels, profileImageKey, username, storyId }) => {
  console.log(panels);
  return (
    <div className={style.pageCover}>
      <Bar className={style.topBar} variant="bottom-border">
        <div className={style.profile}>
          <img
            className={style.avatar}
            src={`${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${profileImageKey}?wrap=0`}
          />
          {username}
        </div>
        <div className={style.actions}>
          <PageMore pageId="COVER_PAGE" />
        </div>
      </Bar>
      <Panels
        className={style.pageCoverPanel}
        items={panels}
        storyId={storyId}
        isEditMode={false}
      />
    </div>
  );
};

export default PageCover;
