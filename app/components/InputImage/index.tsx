"use client";

import { useEffect, useRef, useState } from "react";
import { Image, Trash2 } from "react-feather";

import Bar from "../Bar";
import ButtonWrapper from "../ButtonWrapper";
import SecondaryButton from "../Buttons/Secondary";
import style from "./style.module.css";

const getImage = (image: any) => {
  if (typeof image === "object") {
    const blob = new Blob([image], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  }
  return `${process.env.NEXT_PUBLIC_STORJ_PUBLIC_URL}/${image}?wrap=0`;
};

interface InputImageProps {
  className?: string;
  onChange?: (file: File | string | null) => void;
  value?: File | string | null;
}

const InputImage = ({
  className,
  onChange = () => {},
  value = null,
}: InputImageProps) => {
  const didMount = useRef(false);
  const [imageFileState, setImageFileState] = useState<File | string | null>(
    value
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (didMount.current) {
      onChange(imageFileState);
    }
    didMount.current = true;
  }, [imageFileState]);

  return (
    <div className={[style.inputImage, "inputImage", className].join(" ")}>
      {imageFileState && (
        <img className={style.img} src={getImage(imageFileState)} alt="" />
      )}
      {imageFileState && (
        <Bar className={style.bar}>
          <ButtonWrapper
            className={style.buttonRemoveImage}
            onClick={() => {
              setImageFileState(null);
            }}
          >
            <SecondaryButton>
              Remove Image
              <Trash2 />
            </SecondaryButton>
          </ButtonWrapper>
        </Bar>
      )}
      {!imageFileState && (
        <ButtonWrapper
          className={style.buttonAddImage}
          onClick={() => inputRef.current?.click()}
        >
          <Image color="#222" />
        </ButtonWrapper>
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
              setImageFileState(file);
            } catch (error) {
              console.error(error);
            }
          }
        }}
        ref={inputRef}
      />
    </div>
  );
};

export default InputImage;
