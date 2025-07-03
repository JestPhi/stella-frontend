import { Menu } from "react-feather";
import style from "./style.module.css";
import MenuProfile from "../MenuProfile";
import Button from "../../components/Button";
import { useGlobalContext } from "../../context/context";
import image from "./image.jpg";

const ButtonMenu = () => {
  const { dispatch } = useGlobalContext();

  return (
    <Button
      onClick={() => {
        dispatch({
          type: "SET_MENU",
          payload: { template: <MenuProfile />, heading: "" },
        });
      }}
    >
      <img className={style.image} src={image} />
    </Button>
  );
};

export default ButtonMenu;
