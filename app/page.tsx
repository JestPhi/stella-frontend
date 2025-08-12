"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Masonry from "react-responsive-masonry";
import { useRouter } from "next/navigation";

// Inline styles to replace the imported CSS
const homeStyles = {
  stories: {
    padding: "8px",
  },
  story: {
    cursor: "pointer",
  },
  title: {
    padding: "8px 2px 8px 2px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    position: "sticky" as const,
    top: 0,
  },
  bottomBar: {
    bottom: 0,
    justifyContent: "space-between",
    position: "fixed" as const,
  },
};

export default function Home() {
  const router = useRouter();

  // TanStack Query for fetching all stories
  const { data: stories = [] } = useQuery({
    queryKey: ["stories"],
    queryFn: () => {
      return axios(`${process.env.NEXT_PUBLIC_STELLA_APP_HOST}/stories`).then(
        (response) => {
          return response.data.stories;
        }
      );
    },
  });

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
              />
              <div className="title">{story?.coverPage[`1`]?.value}</div>
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}
