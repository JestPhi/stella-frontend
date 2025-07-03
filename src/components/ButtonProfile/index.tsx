import { Menu } from "react-feather";
import style from "./style.module.css";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";

const ButtonProfile = () => {
  const { dispatch } = useGlobalContext();
  return (
    <Button
      onClick={() => {
        dispatch({
          type: "SET_MENU",
          payload: { template: <h1>Menu</h1>, heading: "Profile" },
        });
      }}
    ></Button>
  );
};

export default ButtonProfile;
