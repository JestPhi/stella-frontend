import style from "./style.module.css";

const Meta = ({ className, pageCount }) => {
  return (
    <div className={[className, style.meta].join(" ")}>
      {[{ attribute: "Pages", value: pageCount }].map((item) => {
        return (
          <div className={style.attribute}>
            {item.attribute} <span className={style.count}>{item.value}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Meta;
