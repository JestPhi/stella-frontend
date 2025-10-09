import InputImage from "../InputImage";
import style from "./style.module.css";

type PanelImageItemProps = {
  value: string | File | null;
  className?: string;
  gridClasses: string;
  isEditMode: boolean;
  onChange: (value: string | File | null) => void;
};

const PanelImageItem = ({
  value,
  gridClasses,
  isEditMode,
  onChange,
}: PanelImageItemProps) => {
  if (isEditMode) {
    return (
      <div className={gridClasses}>
        <InputImage
          className={style.inputImage}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }

  // Display mode
  const imageKey = typeof value === "string" ? value : "";
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
};

export default PanelImageItem;
