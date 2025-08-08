import { useCallback, useState, memo } from "react";
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
  storyId?: string | null;
};

// Individual Panel Component with local state
const PanelItemComponent = memo(
  ({
    itemKey,
    item,
    isEditMode,
    onItemChange,
    storyId,
  }: {
    itemKey: string;
    item: PanelItem;
    isEditMode: boolean;
    onItemChange: (key: string, value: string | File | null) => void;
    storyId?: string | null;
  }) => {
    const [localValue, setLocalValue] = useState<string | File | null>(
      item.value ?? null
    );

    const {
      grid = {},
      skeleton,
      type,
      className: itemClassName,
      placeholder,
    } = item;
    const { c = 0, r = 0, cs = 0, rs = 0 } = grid;

    const handleValueChange = useCallback(
      (newValue: string | File | null) => {
        setLocalValue(newValue);
        onItemChange(itemKey, newValue);
      },
      [itemKey, onItemChange]
    );

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

    const renderInput = () => {
      switch (type) {
        case "text":
          return (
            <InputTextarea
              className={itemClassName}
              placeholder={placeholder}
              value={typeof localValue === "string" ? localValue : ""}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          );
        case "jpg":
        case "image":
          return (
            <InputImage
              className={itemClassName}
              value={localValue}
              onChange={handleValueChange}
            />
          );
        default:
          return null;
      }
    };

    const renderContent = (): React.ReactNode => {
      switch (type) {
        case "text":
          return typeof localValue === "string" ? (
            <div className={style.text}>{localValue}</div>
          ) : null;
        case "image":
        case "jpg":
          const imageKey = typeof localValue === "string" ? localValue : "";
          return imageKey ? (
            <img
              className={style.avatar}
              src={`${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${imageKey}?wrap=0`}
              alt="Panel content"
            />
          ) : null;
        default:
          return null;
      }
    };

    return (
      <div
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
      >
        {isEditMode ? renderInput() : renderContent()}
      </div>
    );
  }
);

// Add display name for debugging
PanelItemComponent.displayName = "PanelItemComponent";

const Panels = ({
  className,
  items = {},
  isEditMode = false,
  onChange = () => {},
  storyId,
  ...rest
}: PanelsProps) => {
  // Handle individual item changes without maintaining internal state
  const handleItemChange = useCallback(
    (key: string, value: string | File | null) => {
      const updatedItems = {
        ...items,
        [key]: {
          ...items[key],
          value,
        },
      };
      console.log(updatedItems);
      onChange(updatedItems);
    },
    [items, onChange]
  );

  return (
    <div
      className={[style.panels, "panels", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {Object.entries(items).map(([key, item]) => (
        <PanelItemComponent
          key={key}
          itemKey={key}
          item={item}
          isEditMode={isEditMode}
          onItemChange={handleItemChange}
          storyId={storyId}
        />
      ))}
    </div>
  );
};

export default Panels;

// Export for backward compatibility
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
          src={`${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${imageKey}?wrap=0`}
          alt="Panel content"
        />
      ) : null;
    default:
      return null;
  }
};
