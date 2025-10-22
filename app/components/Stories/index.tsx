"use client";

import { Story } from "@/api/stories";
import StoryComponent from "@/components/Story";
import { useRouter } from "next/navigation";
import Masonry from "react-responsive-masonry";

interface StoriesProps {
  stories: Array<Story>;
}

export default function Stories({ stories = [] }: StoriesProps) {
  const router = useRouter();
  return (
    <div className="stories">
      <Masonry columnsCount={2} gutter="8px">
        {stories.map((story: any, index: number) => {
          return <StoryComponent {...story} key={index} />;
        })}
      </Masonry>
    </div>
  );
}
