import style from "./style.module.css";
import Bar from "../Bar";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";
import MenuAddPage from "../MenuAddPage";

const InsertPage = () => {
  const { dispatch } = useGlobalContext();
  return (
    <Bar className={style.wrapper}>
      <Button
        className={style.insertPage}
        onClick={() => {
          dispatch({
            type: "SET_MENU",
            payload: <MenuAddPage />,
          });
        }}
      >
        Insert Page +
      </Button>
    </Bar>
  );
};

export default InsertPage;
