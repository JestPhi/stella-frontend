import React, { ButtonHTMLAttributes, ReactNode } from "react";
import style from "./style.module.css";

type ButtonProps = {
  children?: ReactNode;
  className?: string;
  variant?: keyof typeof style;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  className = "",
  variant,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={[style.button, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <div
        className={[style.inner, "inner", variant ? style[variant] : ""]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </button>
  );
};

export default Button;
