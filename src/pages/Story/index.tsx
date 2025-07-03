import { useEffect, useState } from "react";
import { Menu } from "react-feather";
import Bar from "../../components/Bar";
import Button from "../../components/Button";
import ButtonBack from "../../components/ButtonBack";
import ButtonMenu from "../../components/ButtonMenu";
import ButtonAddPage from "../../components/ButtonAddPage";
import PageCover from "../../components/PageCover";
import Page from "../../components/Page";
import Profile from "../../components/Profile";
import style from "./style.module.css";
import storyData from "../../scheme/story.json";
import Logo from "../../components/Logo";

const Story = () => {
  const { coverPage, pages } = storyData;
  return (
    <>
      <Bar className={style.topBar}>
        <ButtonBack />
        <ButtonMenu />
      </Bar>
      <div className={style.story}>
        <Profile />
        <PageCover isStory={true} {...coverPage} pageCount={pages.length} />
        {pages.map((page, index) => {
          return <Page {...page} pageNumber={index} />;
        })}
      </div>
      <Bar className={style.bottomBar}>
        <Button>
          <Logo />
        </Button>
        <ButtonAddPage />
      </Bar>
    </>
  );
};

export default Story;
