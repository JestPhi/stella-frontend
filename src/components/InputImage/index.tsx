import { useEffect, useRef, useState } from "react";
import { Image } from "react-feather";
import style from "./style.module.css";
import Button from "../Button";
import Bar from "../Bar";

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
        onChange={(event) => {
          const file = event.target.files[0];
          const blob = new Blob([file], { type: "image/png" });
          setImageFileState(blob);
        }}
        ref={inputRef}
      />
    </div>
  );
};

export default InputImage;
