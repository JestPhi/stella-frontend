import { useState } from "react";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import Bar from "../Bar";
import Panels from "../Panels";
import PageEdit from "../PageEdit";
import PanelsSelector from "../PanelsSelector";

const initalState = {
  "0": {
    grid: {
      c: 12,
      r: 10,
      rs: 0,
      cs: 0,
    },
    skeleton: "default",
    type: "text",
  },
  "1": {
    grid: {
      c: 12,
      r: 2,
      rs: 10,
      cs: 0,
    },
    skeleton: "text",
  },
};

const MenuAddPage = () => {
  const [grid, setGrid] = useState(initalState);
  console.log(grid, "changed");
  return (
    <div>
      <PanelsSelector
        onChange={(data) => {
          setGrid(data);
        }}
      />
      <PageEdit
        key={Date.now()}
        items={grid}
        isEditMode={true}
        onChange={(data) => {
          console.log(data);
        }}
      />
    </div>
  );
};

export default MenuAddPage;
