import { useState } from "react";

import Panels from "../Panels";

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
    type: "text",
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
      <Panels
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
