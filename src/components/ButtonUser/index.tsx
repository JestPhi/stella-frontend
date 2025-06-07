import { Menu } from "react-feather";
import style from "./style.module.css";
import Button from "../../components/Button";
import { useGlobalContext } from "../../context/context";

const ButtonUser = () => {
  const { dispatch } = useGlobalContext();
  return (
    <Button
      onClick={() => {
        dispatch({ type: "SET_MENU", payload: <h1>Menu</h1> });
      }}
    ></Button>
  );
};

export default ButtonUser;
