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

type InputAvatarProps = {
  className?: string;
  onChange: (imageBlob: string | null) => void;
};

const InputAvatar = ({ className, onChange }: InputAvatarProps) => {
  const [imageBlobString, setImageBlobString] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange(imageBlobString);
  }, [imageBlobString]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className={[style.inputImage, className].join(" ")}>
      <div className={style.imageWrapper}>
        {imageBlobString && (
          <img className={style.img} src={imageBlobString} alt="" />
        )}
        {!imageBlobString && (
          <Button
            className={style.buttonAddImage}
            onClick={() => inputRef.current?.click()}
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
                setImageBlobString(base64String);
              } catch (error) {
                console.error("Error converting file to base64:", error);
              }
            }
          }}
          ref={inputRef}
        />
      </div>
      {imageBlobString && (
        <Button
          className={style.buttonImageAction}
          onClick={() => {
            setImageBlobString(null);
          }}
          variant="fill"
        >
          <Trash height={16} />
        </Button>
      )}
      {!imageBlobString && (
        <Button
          className={style.buttonImageAction}
          onClick={() => {
            inputRef.current?.click();
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
