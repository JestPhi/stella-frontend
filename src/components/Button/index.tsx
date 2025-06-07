import style from "./style.module.css";

const Button = ({ children, className, variant, ...rest }) => {
  return (
    <button className={[style.button, className].join(" ")} {...rest}>
      <div className={[style.inner, style[variant]].join(" ")}>{children}</div>
    </button>
  );
};

export default Button;
