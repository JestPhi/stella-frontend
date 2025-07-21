import { useEffect, useRef, useState } from "react";
import { Image } from "react-feather";
import style from "./style.module.css";
import Button from "../Button";
import Bar from "../Bar";
import { Plus, Trash } from "react-feather";

const getImage = (image: any) => {
  if (typeof image === "object") {
    const blob = new Blob([image], { type: "image/png" });
    return URL.createObjectURL(blob);
  }
  return image;
};

const InputAvatar = ({ className, onChange }) => {
  const [imageFileState, setImageFileState] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    onChange(imageFileState);
  }, [imageFileState]);

  return (
    <div className={[style.inputImage, className].join(" ")}>
      <div className={style.imageWrapper}>
        {imageFileState && (
          <img className={style.img} src={getImage(imageFileState)} alt="" />
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
      {imageFileState && (
        <Button
          className={style.buttonImageAction}
          onClick={() => {
            setImageFileState(null);
          }}
          variant="fill"
        >
          <Trash height={16} />
        </Button>
      )}
      {!imageFileState && (
        <Button
          className={style.buttonImageAction}
          onClick={() => {
            setImageFileState(null);
          }}
          variant="fill"
        >
          <Plus height={16} />
        </Button>
      )}
    </div>
  );
};

export default InputAvatar;
