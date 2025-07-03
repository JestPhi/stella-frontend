import style from "./style.module.css";
import image from "./image.jpg";

const Avatar = ({ src }) => {
  return <img className={style.image} src={src} />;
};

export default Avatar;
