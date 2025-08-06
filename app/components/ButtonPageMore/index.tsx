"use client";

import { MoreHorizontal } from "react-feather";
import { useParams } from "next/navigation";
import style from "./style.module.css";
import MenuPageMore from "../MenuPageMore";
import Button from "../../components/Button";
import { useGlobalContext } from "../../context/context";

const ButtonPageMore = ({}) => {
  const { stellaId, storyId } = useParams();

  return (
    <Button
      onClick={() => {
        parent.postMessage(
          {
            action: "SET_MODAL_URL",
            payload: `/story-actions/${stellaId}/${storyId}`,
          },
          "http://localhost:3015"
        );
      }}
    >
      <MoreHorizontal color="#444" height={18} />
    </Button>
  );
};

export default ButtonPageMore;
