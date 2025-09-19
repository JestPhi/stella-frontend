import { useState } from "react";
import Bar from "../Bar";
import Panels from "../Panels";
import style from "./style.module.css";

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

interface PanelsSelectorProps {
  onChange?: (data: any) => void;
}

const PanelsSelector = ({ onChange = () => {} }: PanelsSelectorProps) => {
  const [selected, setSelected] = useState(0);

  const handleClick = (index: number) => {
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
          // Filter out undefined values and ensure all items have required properties
          const validItems = Object.fromEntries(
            Object.entries(panel).filter(([key, item]) => item !== undefined)
          );

          return (
            <div
              key={index}
              className={index === selected ? style.selected : ""}
              onClick={() => {
                handleClick(index);
              }}
            >
              <Panels isEditMode={false} items={validItems} />
            </div>
          );
        })}
      </Bar>
    </div>
  );
};

export default PanelsSelector;
