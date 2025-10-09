import { useEffect, useRef, useState } from "react";
import { Image, Plus, Trash } from "react-feather";
import Button from "../ButtonWrapper";
import style from "./style.module.css";

type InputProfileImageProps = {
  className?: string;
  imageURL?: string | null;
  onChange: (file: File | null) => void;
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

      // Pass the actual File object to parent
      onChange(file);
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
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset input to allow same file selection
      inputRef.current.click();
    }
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
            type="button"
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
            console.log("File input onChange triggered", event.target.files);
            const file = event.target.files?.[0];
            if (file) {
              handleImageSelect(file);
            }
            // Reset the input value to allow selecting the same file again
            event.target.value = "";
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
          type="button"
        >
          <Plus height={16} />
        </Button>
      )}
    </div>
  );
};

export default InputProfileImage;
