import style from "./style.module.css";
import image from "./image.jpg";
import image2 from "./image2.jpg";
import Meta from "../Meta";
import Avatar from "../Avatar";
import Bar from "../Bar";

const Story = () => {
  const randomNumber = Math.random();
  const images = randomNumber > 0.5 ? image : image2;

  return (
    <button className={style.story}>
      <Bar>
        <img className={style.avatar} src={image} />
        <div className={style.meta}>
          <span className={style.name}>Phi Le</span>
        </div>
      </Bar>
      <img className={style.image} src={images} />

      <div className={style.title}>
        Excepteur sint occaecat help non proident...
        <Meta pageCount={15} />
      </div>
    </button>
  );
};

export default Story;
