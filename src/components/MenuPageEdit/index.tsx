import { useEffect, useState } from "react";
import globalStyle from "../../../src/style.module.css";
import style from "./style.module.css";
import PageEdit from "../PageEdit";
import Button from "../Button";
import { useGlobalContext } from "../../context/context";
import { getStory } from "../../api";

const MenuPageEdit = ({ stellaId, storyId }) => {
  const { dispatch, state } = useGlobalContext();
  const [story, setStory] = useState();

  useEffect(() => {
    getStory(stellaId, storyId).then((data) => {
      setStory(data);
    });
  }, [stellaId, storyId]);

  return (
    <div className={style.MenuPageMore}>
      <PageEdit
        items={story?.coverPage}
        isEditMode={true}
        onChange={(value) => {
          setStory((prev) => {
            return {
              ...prev,
              coverPage: value,
            };
          });
        }}
      />
      <Button
        variant="primary"
        onClick={() => {
          console.log(story, "save story here");
        }}
      >
        Update Page
      </Button>
    </div>
  );
};

export default MenuPageEdit;
