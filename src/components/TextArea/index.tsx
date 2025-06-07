import style from "./style.module.css";

const Textarea = ({ ...rest }) => {
  return <textarea className={style.textarea} {...rest} />;
};

export default Textarea;
