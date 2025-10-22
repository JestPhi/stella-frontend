"use client";

import Bar from "@/components/Bar";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";

interface StoryProps {
  coverPage: any;
  storyId: string;
  stellaId: string;
}

export default function Story({ coverPage, storyId, stellaId }: StoryProps) {
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useProfile(stellaId);

  const router = useRouter();

  return (
    <a
      key={storyId}
      className="story"
      href={`/profile/${stellaId}/story/${storyId}`}
    >
      <Bar>
        <img
          className={styles.avatar}
          src={`${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${profileResponse?.profile?.profileImageKey}?wrap=0`}
        />
        {profileResponse?.profile?.username}
      </Bar>
      <img
        className={styles.coverImage}
        src={`${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${
          coverPage?.[`0`]?.value
        }?wrap=0`}
        alt={coverPage?.[`1`]?.value}
        loading="lazy"
      />
      <div className={styles.title}>{coverPage?.[`1`]?.value}</div>
    </a>
  );
}
