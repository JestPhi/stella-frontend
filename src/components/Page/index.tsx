import style from "./style.module.css";
import Bar from "../Bar";
import ButtonDeletePage from "../ButtonDeletePage";
import ButtonEditPage from "../ButtonEditPage";
import ButtonPageMore from "../ButtonPageMore";
import InsertPage from "../InsertPage";
import image from "./image.jpg";

const Page = (props) => {
  const { pageNumber, src, text } = props;
  return (
    <div className={style.page}>
      <Bar className={style.bar}>
        <ButtonPageMore />
      </Bar>
      <img className={style.image} src={src} loading="lazy" />
      <div className={style.content}>
        <p className={style.text}>{text}</p>
        <div className={style.pageNumber}>{pageNumber + 1}</div>
      </div>
    </div>
  );
};

export default Page;
