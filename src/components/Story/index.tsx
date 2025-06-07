import style from "./style.module.css";
import image from "./image.jpg";
import image2 from "./image2.jpg";

const Story = () => {
  const randomNumber = Math.random();
  const images = randomNumber > 0.5 ? image : image2;

  return (
    <button className={style.story}>
      <img className={style.image} src={images} />
      <div className={style.title}>
        Excepteur sint occaecat help cupidatat non proident...
      </div>
    </button>
  );
};

export default Story;
