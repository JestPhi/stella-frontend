import { Plus } from "react-feather";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import Button from "../../components/Button";
import MenuAddPage from "../MenuAddPage";

const ButtonAddPage = () => {
  const { dispatch } = useGlobalContext();
  return (
    <Button
      onClick={() => {
        dispatch({ type: "SET_MENU", payload: MenuAddPage });
      }}
    >
      <Plus />
    </Button>
  );
};

export default ButtonAddPage;
