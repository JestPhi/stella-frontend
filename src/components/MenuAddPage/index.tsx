import { useState } from "react";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import InputImage from "../InputImage";
import Textarea from "../InputTextarea";
import Bar from "../Bar";
import Panels from "../Panels";
import PageEdit from "../PageEdit";

const MenuAddPage = () => {
  const { dispatch, state } = useGlobalContext();
  const [imageBlobState, setImageBlobState] = useState();
  const [textState, setTextState] = useState();

  return (
    <div>
      <Bar className={style.bar}>
        <Panels items={[{ c: 12, r: 12, rs: 0, cs: 0, skeleton: "default" }]} />
        <Panels
          className={style.selected}
          items={[
            { c: 12, r: 9, rs: 0, cs: 0, skeleton: "default" },
            { c: 12, r: 3, rs: 9, cs: 0, skeleton: "default" },
          ]}
        />
      </Bar>
      <PageEdit />
    </div>
  );
};

export default MenuAddPage;
