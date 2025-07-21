import globalStyle from "../../../src/style.module.css";
import style from "./style.module.css";
import Avatar from "../Avatar";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";

const MenuPageMore = ({ isCoverPage }) => {
  const { dispatch, state } = useGlobalContext();

  return (
    <div className={style.MenuPageMore}>
      <div className={style.actions}>
        <div className={style.heading}>
          {isCoverPage && "Cover "}Page Actions
        </div>
        <Button className={style.action}>
          Edit {isCoverPage && "Cover "} Page
        </Button>
        {!isCoverPage && (
          <Button className={style.action}>
            Create new page & insert between page 4...5
          </Button>
        )}
        {!isCoverPage && <Button className={style.action}>Delete Page</Button>}
      </div>
      <div className={style.actions}>
        <div className={[style.heading, style.pageActionsHeading].join(" ")}>
          Story Actions
        </div>
        <Button className={style.action}>Change page sequence</Button>
        <Button className={style.action}>Order pages by Page Number</Button>
        <Button className={style.action}>Delete Story</Button>
      </div>
    </div>
  );
};

export default MenuPageMore;
