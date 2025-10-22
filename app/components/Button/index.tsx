import { HTMLAttributes, ReactNode } from "react";
import style from "./style.module.css";

type ButtonProps = {
  children?: ReactNode;
  variant?: keyof typeof style;
} & HTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  className = "",
  variant,
  ...rest
}: ButtonProps) => {
  return (
    <button className={[style.button, className].join(" ")} {...rest}>
      {children}
    </button>
  );
};

export default Button;
