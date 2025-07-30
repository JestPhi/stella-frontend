import { useEffect, useState } from "react";
import style from "./style.module.css";
import InputImage from "../InputImage";
import InputTextarea from "../InputTextarea";

const getSkeleton = (skeleton) => {
  switch (skeleton) {
    case "default":
      return "default";
    case "text":
      return "text";
    default:
      return "";
  }
};

const getInput = (
  type,
  { setItemsState, value = "", grid, index, ...rest }
) => {
  console.log(value);
  switch (type) {
    case "textarea":
      return (
        <InputTextarea
          {...rest}
          value={value}
          onChange={(e) =>
            setItemsState((prev) => {
              return {
                ...prev,
                [`${index}`]: {
                  type: type,
                  value: e.target.value,
                  grid: grid,
                },
              };
            })
          }
        />
      );
    case "image":
      return (
        <InputImage
          {...rest}
          value={value}
          onChange={(blob) => {
            setItemsState((prev) => {
              return {
                ...prev,
                [`${index}`]: { type: type, value: blob, grid: grid },
              };
            });
          }}
        />
      );
    default:
      break;
  }
};

export const getContent = (type, value = "", stellaId, storyId) => {
  switch (type) {
    case "textarea":
      return value;
    case "image":
      return (
        <img
          className={style.avatar}
          src={`${import.meta.env.VITE_STORJ_PUBLIC_URL}/${value}?wrap=0`}
        />
      );
    default:
      break;
  }
};

const Panels = ({
  className,
  items = {},
  isEditMode = true,
  onChange = () => {},
  stellaId,
  storyId,
}) => {
  const [itemsState, setItemsState] = useState(items);

  useEffect(() => {
    onChange(itemsState);
  }, [itemsState]);
  console.log(items);
  return (
    <div className={[style.panels, "panels", className].join(" ")}>
      {Object.values(items).map(
        (
          { grid = {}, skeleton, type, className, placeholder, value },
          index
        ) => {
          const { c = 0, r = 0, cs = 0, rs = 0 } = grid;

          return (
            <div
              className={[
                style.item,
                style[`rs${rs}`],
                style[`cs${cs}`],
                style[`r${r}`],
                style[`c${c}`],
                getSkeleton(skeleton),
                className,
              ].join(" ")}
              data-panel-index={index}
            >
              {isEditMode &&
                getInput(type, {
                  index,
                  grid: { c: c, cs: cs, r: r, rs: rs },
                  value: value,
                  setItemsState,
                  className: className,
                  placeholder: placeholder,
                })}
              {!isEditMode && getContent(type, value, stellaId, storyId)}
            </div>
          );
        }
      )}
    </div>
  );
};

export default Panels;
