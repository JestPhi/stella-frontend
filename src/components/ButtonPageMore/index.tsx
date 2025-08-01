import { MoreHorizontal } from "react-feather";
import { useParams } from "react-router";
import style from "./style.module.css";
import MenuPageMore from "../MenuPageMore";
import Button from "../../components/Button";
import { useGlobalContext } from "../../context/context";

const ButtonPageMore = ({ isCoverPage, onDelete, stellaId, storyId }) => {
  const { dispatch } = useGlobalContext();

  return (
    <Button
      onClick={() => {
        dispatch({
          type: "SET_MENU",
          payload: {
            template: (
              <MenuPageMore
                isCoverPage={isCoverPage}
                onDelete={onDelete}
                stellaId={stellaId}
                storyId={storyId}
              />
            ),
            heading: isCoverPage ? "Cover Page" : "Page",
          },
        });
      }}
    >
      <MoreHorizontal color="#444" height={18} />
    </Button>
  );
};

export default ButtonPageMore;
