import { useCallback, useEffect, useState } from "react";
import PanelImageItem from "./PanelImageItem";
import PanelTextItem from "./PanelTextItem";
import style from "./style.module.css";

// Types
type GridConfig = {
  c?: number; // column
  r?: number; // row
  cs?: number; // column span
  rs?: number; // row span
};

type PanelItem = {
  grid?: GridConfig;
  skeleton?: string;
  type: string;
  className?: string;
  placeholder?: string;
  value?: string | File | null;
};

type PanelItemComponentProps = {
  itemKey: string;
  item: PanelItem;
  isEditMode: boolean;
  onItemChange: (key: string, value: string | File | null) => void;
  storyId?: string | null;
};

const PanelItemComponent = ({
  itemKey,
  item,
  isEditMode,
  onItemChange,
}: PanelItemComponentProps) => {
  // Local state for immediate UI updates
  const [localValue, setLocalValue] = useState<string | File | null>(
    item.value ?? null
  );

  // Sync local state when parent value changes
  useEffect(() => {
    setLocalValue(item.value ?? null);
  }, [item.value]);

  // Extract item properties
  const { grid = {}, skeleton, type, placeholder } = item;

  // Extract grid properties with defaults
  const { c = 1, r = 1, cs = 1, rs = 1 } = grid;

  // Handle value changes (update both local and parent state)
  const handleValueChange = useCallback(
    (newValue: string | File | null) => {
      setLocalValue(newValue);

      onItemChange(itemKey, newValue);
    },
    [itemKey, onItemChange]
  );

  // Generate CSS classes for grid positioning
  const generateGridClasses = () =>
    [
      style.item,
      style[`rs${rs}`],
      style[`cs${cs}`],
      style[`r${r}`],
      style[`c${c}`],
      skeleton && style[skeleton],
    ]
      .filter(Boolean)
      .join(" ");

  const gridClasses = generateGridClasses();

  // Render appropriate component based on type
  switch (type) {
    case "text":
      return (
        <PanelTextItem
          value={typeof localValue === "string" ? localValue : ""}
          placeholder={placeholder}
          gridClasses={gridClasses}
          isEditMode={isEditMode}
          onChange={handleValueChange}
        />
      );

    case "jpg":
    case "image":
      return (
        <PanelImageItem
          value={localValue}
          gridClasses={gridClasses}
          isEditMode={isEditMode}
          onChange={handleValueChange}
        />
      );

    default:
      return <div className={gridClasses} />;
  }
};

export default PanelItemComponent;
export type { GridConfig, PanelItem };
