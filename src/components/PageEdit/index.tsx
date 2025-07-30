import Panels from "../Panels";
import style from "./style.module.css";

const PageEdit = ({ items, isEditMode, onChange }) => {
  return (
    <Panels
      className={style.panels}
      items={items}
      onChange={onChange}
      isEditMode={isEditMode}
    />
  );
};

export default PageEdit;
