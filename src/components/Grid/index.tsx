import { useState } from "react";
import style from "./style.module.css";

const Grid = ({ className, cols = 1, rows = 1, onChange }) => {
  const items = cols * rows;
  let itemsArray = [];

  for (let index = 0; index < items; index++) {
    itemsArray = [...itemsArray, null];
  }

  return (
    <div
      className={[style.grid, style[`c${cols}`], "grid", className].join(" ")}
    >
      {itemsArray.map((item) => {
        return <div className={[style.item].join(" ")}>{item}</div>;
      })}
    </div>
  );
};

export default Grid;
