import style from "./style.module.css";
import { X } from "react-feather";
import Bar from "../Bar";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";
import { useAuthContext } from "../../context/auth";

const Menu = () => {
  const { dispatch, state } = useGlobalContext();
  const isOpen = !!state.menu;

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
        ,
        <div className={style.menu}>
          <Bar className={style.topBar}>
            <span className={style.heading}>Page 4</span>
            <Button
              onClick={() => {
                dispatch({ type: "SET_MENU", template: null });
              }}
            >
              <X height={18} color="#444" />
            </Button>
          </Bar>
          {state.menu}
        </div>
      </>
    )
  );
};

export default Menu;
