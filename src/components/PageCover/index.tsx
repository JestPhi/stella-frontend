import style from "./style.module.css";
import image from "./image.jpg";
import Bar from "../Bar";
import ButtonEditPage from "../ButtonEditPage";
import InsertPage from "../InsertPage";
import Meta from "../Meta";

const PageCover = ({ isStory = false }) => {
  return (
    <div className={style.pageCover}>
      <Bar className={style.topBar}>
        <ButtonEditPage />
      </Bar>
      <img className={style.image} src={image} />
      <div className={style.content}>
        <p className={style.title}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <Meta />
      </div>
      {isStory && <InsertPage />}
    </div>
  );
};

export default PageCover;
