"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import InputImage from "../InputImage";
import InputTextarea from "../InputTextarea";
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

type PanelsProps = {
  className?: string;
  items?: Record<string, PanelItem>;
  isEditMode?: boolean;
  onChange?: (items: Record<string, PanelItem>) => void;
  storyId?: string | null;
};

// Individual Panel Item Component
const PanelItemComponent = memo(
  ({
    itemKey,
    item,
    isEditMode,
    onItemChange,
  }: {
    itemKey: string;
    item: PanelItem;
    isEditMode: boolean;
    onItemChange: (key: string, value: string | File | null) => void;
    storyId?: string | null;
  }) => {
    // Local state for immediate UI updates
    const [localValue, setLocalValue] = useState<string | File | null>(
      item.value ?? null
    );

    // Sync local state when parent value changes
    useEffect(() => {
      setLocalValue(item.value ?? null);
    }, [item.value]);

    // Extract item properties
    const {
      grid = {},
      skeleton,
      type,
      className: itemClassName,
      placeholder,
    } = item;

    // Extract grid properties with defaults
    const { c = 0, r = 0, cs = 0, rs = 0 } = grid;

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
        itemClassName,
      ]
        .filter(Boolean)
        .join(" ");

    const gridClasses = generateGridClasses();

    // Render input components for edit mode
    const renderEditMode = () => {
      switch (type) {
        case "text":
          return (
            <div className={gridClasses}>
              <InputTextarea
                className={itemClassName}
                placeholder={placeholder}
                value={typeof localValue === "string" ? localValue : ""}
                onChange={(e) => handleValueChange(e.target.value)}
              />
            </div>
          );

        case "jpg":
        case "image":
          return (
            <div className={gridClasses}>
              <InputImage
                className={itemClassName}
                value={localValue}
                onChange={handleValueChange}
              />
            </div>
          );

        default:
          return <div className={gridClasses} />;
      }
    };

    // Render display components for view mode
    const renderDisplayMode = () => {
      switch (type) {
        case "text":
          const hasTextContent = typeof localValue === "string" && localValue;
          return (
            <div className={gridClasses}>
              {hasTextContent && <div className={style.text}>{localValue}</div>}
            </div>
          );

        case "image":
        case "jpg":
          const imageKey = typeof localValue === "string" ? localValue : "";
          const hasImageContent = Boolean(imageKey);

          return (
            <div className={gridClasses}>
              {hasImageContent && (
                <img
                  className={style.avatar}
                  src={`${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${imageKey}?wrap=0`}
                  alt="Panel content"
                />
              )}
            </div>
          );

        default:
          return <div className={gridClasses} />;
      }
    };

    // Return appropriate mode
    return isEditMode ? renderEditMode() : renderDisplayMode();
  }
);

// Add display name for React DevTools
PanelItemComponent.displayName = "PanelItemComponent";

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
        ...dataRef.current,
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
  const containerClasses = [style.panels, "panels", className]
    .filter(Boolean)
    .join(" ");

  return (
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
  );
};

export default Panels;
