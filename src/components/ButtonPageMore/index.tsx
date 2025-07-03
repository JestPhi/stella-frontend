import { MoreHorizontal } from "react-feather";
import style from "./style.module.css";
import MenuPageMore from "../MenuPageMore";
import Button from "../../components/Button";
import { useGlobalContext } from "../../context/context";

const ButtonPageMore = ({ isCoverPage }) => {
  const { dispatch } = useGlobalContext();

  return (
    <Button
      onClick={() => {
        dispatch({
          type: "SET_MENU",
          payload: {
            template: <MenuPageMore isCoverPage={isCoverPage} />,
            heading: "Page 4 Actions",
          },
        });
      }}
    >
      <MoreHorizontal color="#444" height={18} />
    </Button>
  );
};

export default ButtonPageMore;
