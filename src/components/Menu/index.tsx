import style from "./style.module.css";
import { X } from "react-feather";
import Bar from "../Bar";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";

const Menu = ({ heading, template }) => {
  const { dispatch, state } = useGlobalContext();
  const isOpen = !!state?.menu?.template;

  return (
    isOpen && (
      <>
        <div
          role="presentation"
          className={style.backdrop}
          onClick={() => {
            dispatch({ type: "SET_MENU", template: null });
          }}
        ></div>
        <div className={style.menu}>
          <Bar className={style.topBar}>
            <div className={style.empty} />
            <span className={style.heading}>{state?.menu?.heading}</span>
            <Button
              onClick={() => {
                dispatch({ type: "SET_MENU", heading: null, template: null });
              }}
            >
              <X height={18} color="#444" />
            </Button>
          </Bar>
          {state?.menu?.template}
        </div>
      </>
    )
  );
};

export default Menu;
