"use client";

import Bar from "@/components/Bar";
import PageMore from "@/components/Buttons/PageMore";
import Panels from "@/components/Panels";
import style from "./style.module.css";

interface PageCoverProps {
  panels: any;
  profileImageKey?: string;
  username?: string;
  storyId: string;
}

const PageCover = ({
  panels,
  profileImageKey,
  username,
  storyId,
}: PageCoverProps) => {
  return (
    <div className={style.pageCover}>
      <Bar className={style.topBar} variant="bottom-border">
        <div className={style.profile}>
          {profileImageKey && (
            <img
              className={style.avatar}
              src={`${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${profileImageKey}?wrap=0`}
            />
          )}
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
