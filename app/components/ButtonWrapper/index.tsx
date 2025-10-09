import { HTMLAttributes, ReactNode } from "react";
import style from "./style.module.css";

type ButtonProps = {
  children?: ReactNode;
  variant?: keyof typeof style;
} & HTMLAttributes<HTMLDivElement>;

const ButtonWrapper = ({
  children,
  className = "",
  variant,
  ...rest
}: ButtonProps) => {
  return (
    <div className={[style.button, className].join(" ")} {...rest}>
      {children}
    </div>
  );
};

export default ButtonWrapper;
