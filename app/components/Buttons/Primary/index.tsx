import { ButtonHTMLAttributes, ReactNode } from "react";
import style from "./style.module.css";

type ButtonProps = {
  children?: ReactNode;
  variant?: keyof typeof style;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const PrimaryButton = ({
  children,
  className = "",
  variant,
  ...rest
}: ButtonProps) => {
  return (
    <button className={[style.primary, className].join(" ")} {...rest}>
      {children}
    </button>
  );
};

export default PrimaryButton;
