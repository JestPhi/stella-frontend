import style from "./style.module.css";

const Avatar = ({ src }: { src: string }) => {
  if (!src) {
    return null;
  }
  return <img className={style.image} src={src} />;
};

export default Avatar;
