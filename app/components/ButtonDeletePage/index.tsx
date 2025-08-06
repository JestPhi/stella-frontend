import { Trash } from "react-feather";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import Button from "../Button";
import MenuAddStory from "../MenuAddStory";

const ButtonDeletePage = () => {
  const { dispatch } = useGlobalContext();
  return (
    <Button
      onClick={() => {
        dispatch({ type: "SET_MENU", payload: <MenuAddStory /> });
      }}
    >
      <Trash color="#444" height={18} />
    </Button>
  );
};

export default ButtonDeletePage;
