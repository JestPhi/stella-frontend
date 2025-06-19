import style from "./style.module.css";
import image from "./image.jpg";
import Bar from "../Bar";
import ButtonPageMore from "../ButtonPageMore";
import InsertPage from "../InsertPage";
import Meta from "../Meta";

const PageCover = ({ isStory = false }) => {
  return (
    <div className={style.pageCover}>
      <Bar className={style.topBar}>
        <ButtonPageMore isCoverPage={true} />
      </Bar>
      <img className={style.image} src={image} loading="lazy" />
      <div className={style.content}>
        <p className={style.title}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <Meta />
      </div>
    </div>
  );
};

export default PageCover;
