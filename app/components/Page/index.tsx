import style from "./style.module.css";
import Bar from "../Bar";
import ButtonDeletePage from "../ButtonDeletePage";
import ButtonEditPage from "../ButtonEditPage";
import ButtonPageMore from "../ButtonPageMore";
import InsertPage from "../InsertPage";
import image from "./image.jpg";
import Panels from "../Panels";

const Page = (props) => {
  const { pageNumber, src, text } = props;
  return (
    <div className={style.page}>
      <Bar className={style.bar}>
        <ButtonPageMore />
      </Bar>
      <Panels
        items={[
          {
            c: 12,
            cs: 0,
            r: 9,
            rs: 0,
            content: <img src={image} />,
            className: "image",
          },
          {
            c: 12,
            cs: 0,
            r: 3,
            rs: 9,
            content: <div>Lorem Ipsum</div>,
            className: "text",
          },
        ]}
      />
      <Bar className={style.pageNumber}>{pageNumber + 1}</Bar>
    </div>
  );
};

export default Page;
