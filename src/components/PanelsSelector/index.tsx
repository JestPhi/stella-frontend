import { useEffect, useState } from "react";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import Bar from "../Bar";
import Panels from "../Panels";

const panelsSelections = [
  {
    "0": {
      grid: {
        c: 12,
        r: 10,
        rs: 0,
        cs: 0,
      },
      type: "jpg",
      skeleton: "default",
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
  },
  {
    "0": {
      grid: {
        c: 12,
        r: 12,
        rs: 0,
        cs: 0,
      },
      type: "jpg",
      skeleton: "default",
    },
  },
];

const PanelsSelector = ({ onChange = () => {} }) => {
  const [selected, setSelected] = useState(0);

  const handleClick = (index) => {
    const a = Object.values(panelsSelections[index]).reduce(
      (prev, curr, index) => {
        return {
          ...prev,
          [`${index}`]: { ...curr, skeleton: undefined },
        };
      },
      {}
    );

    setSelected(index);
    onChange({ ...a });
  };

  return (
    <div>
      <Bar className={style.bar}>
        {panelsSelections.map((panel, index) => {
          return (
            <Panels
              isEditMode={false}
              key={index}
              className={index === selected ? style.selected : ""}
              items={panel}
              onClick={() => {
                handleClick(index);
              }}
            />
          );
        })}
      </Bar>
    </div>
  );
};

export default PanelsSelector;
