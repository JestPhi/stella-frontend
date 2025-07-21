import style from "./style.module.css";
import image from "./image.jpg";
import Bar from "../Bar";
import ButtonPageMore from "../ButtonPageMore";
import InsertPage from "../InsertPage";
import Meta from "../Meta";

const PageCover = ({ pageCount, imageBlob, title }) => {
  const getImage = (image: any) => {
    if (typeof image === "object") {
      const blob = new Blob([image], { type: "image/png" });
      return URL.createObjectURL(blob);
    }
    return image;
  };

  return (
    <div className={style.pageCover}>
      <Bar className={style.topBar}>
        <ButtonPageMore isCoverPage={true} />
      </Bar>
      <img className={style.image} src={getImage(imageBlob)} loading="lazy" />
      <div className={style.content}>
        <p className={style.title}>{title}</p>
        <Meta pageCount={pageCount} />
      </div>
    </div>
  );
};

export default PageCover;
