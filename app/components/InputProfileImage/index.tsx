import { useEffect, useRef, useState } from "react";
import { Image, Plus, Trash } from "react-feather";
import style from "./style.module.css";
import Button from "../Button";

type InputProfileImageProps = {
  className?: string;
  imageURL?: string | null;
  onChange: (imageSource: string | null) => void;
};

const InputProfileImage = ({
  className,
  imageURL = null,
  onChange,
}: InputProfileImageProps) => {
  const [imageSource, setImageSource] = useState<string | null>(imageURL);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentBlobUrlRef = useRef<string | null>(null);

  // Update local state when imageURL prop changes
  useEffect(() => {
    setImageSource(imageURL);
  }, [imageURL]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
      }
    };
  }, []);

  const handleImageSelect = (file: File) => {
    try {
      // Clean up previous blob URL
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
      }

      // Create new blob URL for preview
      const blobUrl = URL.createObjectURL(file);
      currentBlobUrlRef.current = blobUrl;
      setImageSource(blobUrl);
      onChange(blobUrl);
    } catch (error) {
      console.error("Error creating blob URL:", error);
    }
  };

  const handleRemoveImage = () => {
    // Clean up blob URL if it exists
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }
    setImageSource(null);
    onChange(null);
  };

  const handleAddImageClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={[style.inputImage, className].join(" ")}>
      <div className={style.imageWrapper}>
        {imageSource && (
          <img className={style.img} src={imageSource} alt="Profile" />
        )}
        {!imageSource && (
          <Button
            className={style.buttonAddImage}
            onClick={handleAddImageClick}
          >
            <Image color="#222" />
          </Button>
        )}
        <input
          className={style.input}
          id="input"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              handleImageSelect(file);
            }
          }}
          ref={inputRef}
        />
      </div>
      {imageSource && (
        <Button
          className={style.buttonImageAction}
          onClick={handleRemoveImage}
          variant="fill"
        >
          <Trash height={16} />
        </Button>
      )}
      {!imageSource && (
        <Button
          className={style.buttonImageAction}
          onClick={handleAddImageClick}
          variant="fill"
        >
          <Plus height={16} />
        </Button>
      )}
    </div>
  );
};

export default InputProfileImage;
