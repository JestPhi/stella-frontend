import { InputHTMLAttributes } from "react";
import style from "./style.module.css";

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const InputText = ({ className, ...rest }: InputTextProps) => {
  return (
    <input
      className={[style.inputText, className].join(" ")}
      {...rest}
      type="text"
    />
  );
};

export default InputText;
