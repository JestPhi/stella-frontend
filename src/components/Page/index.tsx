import style from "./style.module.css";
import Bar from "../Bar";
import ButtonDeletePage from "../ButtonDeletePage";
import ButtonEditPage from "../ButtonEditPage";
import ButtonPageMore from "../ButtonPageMore";
import InsertPage from "../InsertPage";
import image from "./image.jpg";

const Page = () => {
  return (
    <div className={style.page}>
      <Bar className={style.bar}>
        <ButtonPageMore />
      </Bar>
      <img className={style.image} src={image} loading="lazy" />
      <div className={style.content}>
        <p className={style.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
        <div className={style.pageNumber}>1</div>
      </div>
    </div>
  );
};

export default Page;
