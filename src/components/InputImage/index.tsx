import { useEffect, useRef, useState } from "react";
import { Image } from "react-feather";
import style from "./style.module.css";
import Button from "../Button";
import Bar from "../Bar";
import { convertToBase64 } from "../../utils";

const getImage = (image: any) => {
  if (typeof image === "object") {
    const blob = new Blob([image], { type: "image/png" });
    return URL.createObjectURL(blob);
  }
  return image;
};

const InputImage = ({ className, onChange }) => {
  const [imageFileState, setImageFileState] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    onChange(imageFileState);
  }, [imageFileState]);

  return (
    <div className={[style.inputImage, className].join(" ")}>
      {imageFileState && (
        <img className={style.img} src={getImage(imageFileState)} alt="" />
      )}
      {imageFileState && (
        <Bar className={style.bar} position="absolute">
          <Button
            className={style.buttonRemoveImage}
            onClick={() => {
              setImageFileState(null);
            }}
            variant="fill"
          >
            Remove Image
          </Button>
        </Bar>
      )}
      {!imageFileState && (
        <Button
          className={style.buttonAddImage}
          onClick={() => inputRef.current.click()}
        >
          <Image color="#222" />
        </Button>
      )}
      <input
        className={style.input}
        id="input"
        type="file"
        accept="image/*;capture=camera"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file) {
            try {
              const base64String = await convertToBase64(file);
              setImageFileState(base64String);
            } catch (error) {
              console.error("Error converting file to base64:", error);
            }
          }
        }}
        ref={inputRef}
      />
    </div>
  );
};

export default InputImage;
