import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import InputImage from "../InputImage";
import Textarea from "../InputTextarea";
import Panels from "../Panels";
import Bar from "../Bar";
import Button from "../Button";
import PageEdit from "../PageEdit";
import { getUser, createCoverPage } from "../../api";

const MenuAddStory = ({ heading }) => {
  const textareaRef = useRef();
  const [imageBlobState, setImageBlobState] = useState("");
  const [titleState, setTitleState] = useState("");
  const { dispatch, state } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (imageBlobState) {
      textareaRef?.current.focus();
    }
  }, [imageBlobState]);

  return (
    <div className={style.addStoryWrapper}>
      <PageEdit />
      <Bar className={[style.bar].join(" ")}>
        {titleState && imageBlobState && (
          <Button
            className={style.addStory}
            variant="fill"
            onClick={async () => {
              const response = await createCoverPage(
                "stellaId",
                imageBlobState,
                titleState
              );
              if (response.ok) {
                dispatch({
                  type: "SET_MENU",
                  payload: null,
                });
                navigate(`/profile/stellaId/${response.id}`);
              }
            }}
          >
            Add Story
          </Button>
        )}
      </Bar>
    </div>
  );
};

export default MenuAddStory;
