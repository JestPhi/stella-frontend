import { ButtonHTMLAttributes, ReactNode } from "react";
import style from "./style.module.css";

type ButtonProps = {
  children?: ReactNode;
  variant?: keyof typeof style;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Primary = ({
  children,
  className = "",
  variant,
  ...rest
}: ButtonProps) => {
  return (
    <button className={style.primary} {...rest}>
      {children}
    </button>
  );
};

export default Primary;
