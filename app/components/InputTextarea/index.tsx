import React, { useRef } from "react";
import style from "./style.module.css";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...rest }, ref) => {
  return (
    <textarea
      ref={ref}
      className={[style.textarea, "textarea", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    />
  );
});

export default Textarea;
