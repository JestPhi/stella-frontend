import { useState } from "react";
import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import InputImage from "../InputImage";
import Textarea from "../InputTextarea";
import Divider from "../Divider";

const MenuAddPage = () => {
  const { dispatch, state } = useGlobalContext();
  const [imageBlobState, setImageBlobState] = useState();
  const [textState, setTextState] = useState();

  return (
    <div>
      <InputImage
        className={style.inputImage}
        onChange={(imageBlob: string) => {
          setImageBlobState(imageBlob);
        }}
      />
      <Divider />
      <Textarea
        rows={12}
        placeholder="Enter Page Text..."
        onChange={(value) => {
          setTextState(value);
        }}
      />
    </div>
  );
};

export default MenuAddPage;
