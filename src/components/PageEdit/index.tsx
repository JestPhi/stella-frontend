import Panels from "../Panels";
import InputImage from "../InputImage";
import InputTextarea from "../InputTextarea";
import style from "./style.module.css";

const PageEdit = () => {
  return (
    <Panels
      className={style.panels}
      items={[
        {
          c: 12,
          r: 9,
          rs: 0,
          cs: 0,
          skeleton: "default",
          content: (
            <InputImage
              className={style.inputImage}
              onChange={(imageBlob: string) => {
                // setImageBlobState(imageBlob);
              }}
            />
          ),
        },
        {
          c: 12,
          r: 3,
          rs: 9,
          cs: 0,
          skeleton: "text",
          content: (
            <InputTextarea
              placeholder="Enter Page Text..."
              onChange={(value) => {
                // setTextState(value);
              }}
            />
          ),
        },
      ]}
    />
  );
};

export default PageEdit;
