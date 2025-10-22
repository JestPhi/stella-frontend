import Link from "next/link";
import { ComponentProps, ReactNode } from "react";
import style from "./style.module.css";

type AnchorProps = {
  children?: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "className">;

const Anchor = ({ children, className = "", ...rest }: AnchorProps) => {
  return (
    <Link className={[style.anchor, className].join(" ")} {...rest}>
      {children}
    </Link>
  );
};

export default Anchor;
