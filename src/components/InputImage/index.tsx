import { useRef, useState } from "react";
import { X } from "react-feather";
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

const InputImage = ({}) => {
  const [imageFileState, setImageFileState] = useState(null);
  const inputRef = useRef(null);

  return (
    <div className={style.inputImage}>
      {imageFileState && (
        <img className={style.img} src={getImage(imageFileState)} alt="" />
      )}
      {imageFileState && (
        <Bar
          background="none"
          variant="bottom"
          justifyContent="center"
          position="absolute"
        >
          <Button
            className={style.buttonRemoveImage}
            onClick={() => {
              setImageFileState(null);
            }}
            variant="outline"
          >
            Remove Image <X />
          </Button>
        </Bar>
      )}
      {!imageFileState && (
        <Button
          className={style.buttonAddImage}
          onClick={() => inputRef.current.click()}
        >
          Add Image
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
          console.log(blob);
          setImageFileState(blob);
        }}
        ref={inputRef}
      />
    </div>
  );
};

export default InputImage;
