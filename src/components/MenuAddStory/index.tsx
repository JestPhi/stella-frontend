import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import InputImage from "../InputImage";
import Textarea from "../InputTextarea";
import InputTextarea from "../InputTextarea";
import Panels from "../Panels";
import Bar from "../Bar";
import Button from "../Button";
import PageEdit from "../PageEdit";
import { createCoverPage } from "../../api";

const initState = {
  "0": {
    grid: {
      c: 12,
      r: 10,
      rs: 0,
      cs: 0,
    },
    skeleton: "default",
    type: "image",
  },
  "1": {
    grid: {
      c: 12,
      r: 2,
      rs: 10,
      cs: 0,
    },
    type: "textarea",
    placeholder: "Phi Le",
    value: "cake",
  },
};

const MenuAddStory = () => {
  const [coverPage, setCoverPage] = useState(initState);
  const { dispatch, state } = useGlobalContext();
  const navigate = useNavigate();

  const handleCreateCoverPage = async () => {
    const response = await createCoverPage(state.stellaId, coverPage);
    if (response.ok) {
      dispatch({
        type: "SET_MENU",
        payload: null,
      });
      navigate(`/profile/${state.stellaId}/${response.id}`);
    }
  };

  // const isDisabled = !titleState || !imageBlobState;

  return (
    <div className={style.addStoryWrapper}>
      <PageEdit
        items={coverPage}
        isEditMode={true}
        onChange={(value) => {
          setCoverPage(value);
        }}
      />
      <Bar className={[style.bar].join(" ")}>
        <Button
          className={style.addStory}
          variant="primary"
          onClick={handleCreateCoverPage}
        >
          Add Story
        </Button>
      </Bar>
    </div>
  );
};

export default MenuAddStory;
