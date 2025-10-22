import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import InputTextarea from "../InputTextarea";
import style from "./style.module.css";

// Zod schema for text validation
const textSchema = z.string().max(240, "Text must be 240 characters or less");

type PanelTextItemProps = {
  value: string;
  placeholder?: string;
  className?: string;
  gridClasses: string;
  isEditMode: boolean;
  onChange: (value: string) => void;
};

const PanelTextItem = ({
  value,
  placeholder,
  className,
  gridClasses,
  isEditMode,
  onChange,
}: PanelTextItemProps) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleValueChange = useCallback(
    (newValue: string) => {
      const validation = textSchema.safeParse(newValue);
      if (!validation.success) {
        setValidationError(validation.error.issues[0].message);
        newValue = newValue.slice(0, 240);
      } else {
        setValidationError(null);
      }
      onChange(newValue);
    },
    [onChange]
  );

  // Clear error when value changes from parent
  useEffect(() => {
    setValidationError(null);
  }, [value]);

  const currentLength = value.length;
  const remainingChars = 240 - currentLength;

  if (isEditMode) {
    return (
      <div className={gridClasses}>
        <InputTextarea
          className={className}
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
        />
        <div className={style.textFeedback}>
          <span
            className={`${style.charCount} ${
              remainingChars < 0
                ? style.error
                : remainingChars < 20
                ? style.warning
                : ""
            }`}
          >
            {currentLength}/240 characters
          </span>
          {validationError && (
            <span className={style.errorMessage}>{validationError}</span>
          )}
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className={[gridClasses, style.textWrapper].join(" ")}>
      {value && <div className={style.text}>{value}</div>}
    </div>
  );
};

export default PanelTextItem;
