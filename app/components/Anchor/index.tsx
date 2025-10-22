import { HTMLAttributes, ReactNode } from "react";
import style from "./style.module.css";

type AnchorProps = {
  children?: ReactNode;
} & HTMLAttributes<HTMLAnchorElement>;

const Anchor = ({ children, className = "", ...rest }: AnchorProps) => {
  return (
    <a className={[style.anchor, className].join(" ")} {...rest}>
      {children}
    </a>
  );
};

export default Anchor;
