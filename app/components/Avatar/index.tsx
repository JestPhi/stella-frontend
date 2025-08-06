import style from "./style.module.css";
import image from "./image.jpg";

const Avatar = ({ src }: { src: string }) => {
  return <img className={style.image} src={src} />;
};

export default Avatar;
