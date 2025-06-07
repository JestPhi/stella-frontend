import { Edit2 } from "react-feather";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import Button from "../Button";
import MenuAddStory from "../MenuAddStory";

const ButtonEditPage = () => {
  const { dispatch } = useGlobalContext();
  return (
    <Button
      onClick={() => {
        dispatch({ type: "SET_MENU", payload: <MenuAddStory /> });
      }}
    >
      <Edit2 color="#444" height={18} width={18} />
    </Button>
  );
};

export default ButtonEditPage;
