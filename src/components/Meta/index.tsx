import style from "./style.module.css";

const Meta = () => {
  return (
    <div className={style.meta}>
      {[
        { attribute: "Pages", count: 10 },
        { attribute: "Followers", count: 10 },
        { attribute: "Likes", count: 10 },
      ].map((item) => {
        return (
          <div className={style.attribute}>
            {item.attribute} <span className={style.count}>{item.count}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Meta;
