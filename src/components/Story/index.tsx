import style from "./style.module.css";
import Meta from "../Meta";
import Bar from "../Bar";

const Story = () => {
  const randomNumber = Math.random();
  const image = "";

  return (
    <button className={style.story}>
      <Bar>
        <img className={style.avatar} src={image} />
        <div className={style.meta}>
          <span className={style.name}>Phi Le</span>
        </div>
      </Bar>
      <img className={style.image} src={image} />

      <div className={style.title}>
        Excepteur sint occaecat help non proident...
        <Meta pageCount={15} />
      </div>
    </button>
  );
};

export default Story;
