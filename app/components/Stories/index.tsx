"use client";

import Masonry from "react-responsive-masonry";
import styles from "./style.module.css";

export default function Stories({ stories = [] }: StoriesProps) {
  return (
    <div className="stories">
      <Masonry columnsCount={2} gutter="8px">
        {stories.map((story: any, index: number) => {
          return (
            <div
              key={story.storyId}
              className="story"
              onClick={() => {
                parent.postMessage(
                  {
                    type: "SET_LAYOUT",
                    payload: {
                      basePathname: `/profile/${story.stellaId}/story/${story.storyId}`,
                    },
                  },
                  `${process.env.NEXT_PUBLIC_STELLA_REACT_NATIVE_FOR_WEB_HOST}`
                );
              }}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${
                  story?.coverPage[`0`]?.value
                }?wrap=0`}
                alt={story?.coverPage[`1`]?.value}
                loading="lazy"
              />
              <div className={styles.title}>{story?.coverPage[`1`]?.value}</div>
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}
