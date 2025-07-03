import style from "./style.module.css";
import image from "./image.jpg";
import Bar from "../Bar";
import ButtonPageMore from "../ButtonPageMore";
import InsertPage from "../InsertPage";
import Meta from "../Meta";

const PageCover = ({ pageCount, src, text }) => {
  return (
    <div className={style.pageCover}>
      <Bar className={style.topBar}>
        <ButtonPageMore isCoverPage={true} />
      </Bar>
      <img className={style.image} src={src} loading="lazy" />
      <div className={style.content}>
        <p className={style.title}>{text}</p>
        <Meta pageCount={pageCount} />
      </div>
    </div>
  );
};

export default PageCover;
