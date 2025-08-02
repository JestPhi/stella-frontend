import { useCallback, useEffect, useMemo, useState } from "react";
import style from "./style.module.css";
import InputImage from "../InputImage";
import InputTextarea from "../InputTextarea";

type GridConfig = {
  c?: number;
  r?: number;
  cs?: number;
  rs?: number;
};

type PanelItem = {
  grid?: GridConfig;
  skeleton?: string;
  type: string;
  className?: string;
  placeholder?: string;
  value?: string | File | null;
};

type PanelsProps = {
  className?: string;
  items?: Record<string, PanelItem>;
  isEditMode?: boolean;
  onChange?: (items: Record<string, PanelItem>) => void;
  stellaId?: string;
  storyId?: string | null;
};

type GetInputProps = {
  setItemsState: React.Dispatch<
    React.SetStateAction<Record<string, PanelItem>>
  >;
  value?: string | File | null;
  grid: GridConfig;
  index: number;
  className?: string;
  placeholder?: string;
  onChange: (value: string | File | null) => void;
  storyId?: string | null;
};

const getSkeleton = (skeleton?: string): string => {
  switch (skeleton) {
    case "default":
      return "default";
    case "text":
      return "text";
    default:
      return "";
  }
};

const getInput = (type: string, props: GetInputProps) => {
  const {
    setItemsState,
    value = "",
    grid,
    index,
    onChange,
    storyId,
    ...rest
  } = props;

  switch (type) {
    case "text":
      return (
        <InputTextarea
          {...rest}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
      );
    case "jpg":
    case "image":
      return (
        <InputImage
          {...rest}
          value={value}
          storyId={storyId}
          onChange={(e) => {
            onChange(e);
          }}
        />
      );
    default:
      return null;
  }
};

export const getContent = (
  type: string,
  value: string | File | null = ""
): React.ReactNode => {
  switch (type) {
    case "text":
      return typeof value === "string" ? (
        <div className={style.text}>{value}</div>
      ) : null;
    case "image":
    case "jpg":
      const imageKey = typeof value === "string" ? value : "";
      return imageKey ? (
        <img
          className={style.avatar}
          src={`${import.meta.env.VITE_STORJ_PUBLIC_URL}/${imageKey}?wrap=0`}
          alt="Panel content"
        />
      ) : null;
    default:
      return null;
  }
};

const Panels = ({
  className,
  items = {},
  isEditMode = false,
  onChange = () => {},
  storyId,
  ...rest
}: PanelsProps) => {
  const [itemsState, setItemsState] =
    useState<Record<string, PanelItem>>(items);

  useEffect(() => {
    onChange(itemsState);
  }, [JSON.stringify(itemsState)]);

  useEffect(() => {
    setItemsState(items);
  }, [items]);

  const handleChange = (value: string | File | null, index: number) => {
    setItemsState((prev) => {
      return {
        ...prev,
        [`${index}`]: {
          ...prev[`${index}`],
          value: value,
        },
      };
    });
  };

  return (
    <div className={[style.panels, "panels", className].join(" ")} {...rest}>
      {Object.entries(itemsState).map(([key, item], index) => {
        const {
          grid = {},
          skeleton,
          type,
          className: itemClassName,
          placeholder,
          value,
        } = item;
        const { c = 0, r = 0, cs = 0, rs = 0 } = grid;

        return (
          <div
            key={key}
            className={[
              style.item,
              style[`rs${rs}`],
              style[`cs${cs}`],
              style[`r${r}`],
              style[`c${c}`],
              getSkeleton(skeleton),
              itemClassName,
            ]
              .filter(Boolean)
              .join(" ")}
            data-panel-index={index}
          >
            {isEditMode &&
              getInput(type, {
                index,
                grid: { c, cs, r, rs },
                onChange: (value) => {
                  handleChange(value, index);
                },
                value,
                className: itemClassName,
                placeholder,
                setItemsState,
                storyId,
              })}
            {!isEditMode && getContent(type, value)}
          </div>
        );
      })}
    </div>
  );
};

export default Panels;
