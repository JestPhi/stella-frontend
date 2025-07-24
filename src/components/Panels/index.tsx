import { useState } from "react";
import style from "./style.module.css";

const getSkeleton = (skeleton) => {
  switch (skeleton) {
    case "default":
      return "default";
      break;
    case "text":
      return "text";
    default:
      return "";
  }
};

const Panels = ({ className, items }) => {
  return (
    <div className={[style.panels, "panels", className].join(" ")}>
      {items.map((item) => {
        return (
          <div
            className={[
              style.item,
              style[`rs${item.rs}`],
              style[`cs${item.cs}`],
              style[`r${item.r}`],
              style[`c${item.c}`],
              getSkeleton(item.skeleton),
            ].join(" ")}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
};

export default Panels;
