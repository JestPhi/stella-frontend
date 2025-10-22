"use client";

import { useCallback, useRef } from "react";
import PanelItemComponent, { PanelItem } from "./PanelItemComponent";
import style from "./style.module.css";

type PanelsProps = {
  className?: string;
  items?: Record<string, PanelItem>;
  isEditMode?: boolean;
  onChange?: (items: Record<string, PanelItem>) => void;
  storyId?: string | null;
};

// Main Panels Container Component
const Panels = ({
  className,
  items = {},
  isEditMode = false,
  onChange = () => {},
  storyId,
  ...rest
}: PanelsProps) => {
  const dataRef = useRef(items);

  const getValue = (type: string, value: string | File | null) => {
    if (type === "jpg") {
      return { file: value };
    }
    return { value };
  };

  // Handle changes from individual panel items
  const handleItemChange = useCallback(
    (key: string, value: string | File | null) => {
      // Create updated items object with new value
      dataRef.current = {
        ...items,
        [key]: {
          ...items[key],
          ...getValue(items[key].type, value),
        },
      };

      // Notify parent component of changes
      onChange(dataRef.current);
    },
    [items, onChange]
  );

  // Generate container CSS classes
  const containerClasses = [style.panels, className].filter(Boolean).join(" ");

  return (
    <div className={style.panelItemComponentWrapper}>
      <div className={containerClasses} {...rest}>
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
    </div>
  );
};

export default Panels;
