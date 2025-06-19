import style from "./style.module.css";
import image from "./image.jpg";

const Avatar = () => {
  return <img className={style.image} src={image} loading="lazy" />;
};

export default Avatar;
