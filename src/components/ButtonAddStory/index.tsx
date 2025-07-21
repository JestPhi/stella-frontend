import { Plus } from "react-feather";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import Button from "../../components/Button";
import MenuAddStory from "../MenuAddStory";

const Author = () => {
  const { dispatch } = useGlobalContext();
  return (
    <Button
      onClick={() => {
        dispatch({
          type: "SET_MENU",
          payload: {
            heading: "Create New Story",
            template: <MenuAddStory />,
          },
        });
      }}
    >
      <Plus height={18} color="#444" />
    </Button>
  );
};

export default Author;
