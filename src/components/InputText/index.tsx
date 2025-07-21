import style from "./style.module.css";

const InputText = ({ className, ...rest }) => {
  return (
    <input
      className={[style.inputText, className].join(" ")}
      {...rest}
      type="text"
    />
  );
};

export default InputText;
