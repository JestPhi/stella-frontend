import Bar from "../Bar";
import ButtonPageMore from "../ButtonPageMore";
import Panels from "../Panels";
import style from "./style.module.css";

const Page = (props) => {
  const { pageNumber, panels, id } = props;
  return (
    <div className={style.page}>
      <Bar className={style.bar}>
        <ButtonPageMore pageId={id} />
      </Bar>
      <Panels items={panels} />
      <Bar className={style.pageNumber}>{pageNumber + 1}</Bar>
    </div>
  );
};

export default Page;
