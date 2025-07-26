import Panels from "../Panels";
import style from "./style.module.css";

const PageEdit = ({ items }) => {
  return <Panels className={style.panels} items={items} />;
};

export default PageEdit;
