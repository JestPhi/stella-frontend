"use client";
import { useRouter } from "next/navigation";
import Masonry from "react-responsive-masonry";
import styles from "./style.module.css";

interface Story {
  title: string;
}

interface StoriesProps {
  stories: Array<Story>;
}

export default function Stories({ stories = [] }: StoriesProps) {
  const router = useRouter();
  return (
    <div className="stories">
      <Masonry columnsCount={2} gutter="8px">
        {stories.map((story: any, index: number) => {
          return (
            <div
              key={story.storyId}
              className="story"
              onClick={() => {
                router.push(
                  `/profile/${story.stellaId}/story/${story.storyId}`
                );
              }}
            >
              <img
                src={`${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${
                  story?.coverPage?.[`0`]?.value
                }?wrap=0`}
                alt={story?.coverPage?.[`1`]?.value}
                loading="lazy"
              />
              <div className={styles.title}>
                {story?.coverPage?.[`1`]?.value}
              </div>
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}
