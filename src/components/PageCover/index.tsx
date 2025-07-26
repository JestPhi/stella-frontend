import style from "./style.module.css";
import Bar from "../Bar";
import ButtonPageMore from "../ButtonPageMore";

import Meta from "../Meta";
import Panels from "../Panels";

const PageCover = ({ imageBlob, title }) => {
  const getImage = (image: any) => {
    if (typeof image === "object") {
      const blob = new Blob([image], { type: "image/png" });
      return URL.createObjectURL(blob);
    }
    return image;
  };

  return (
    <div className={style.pageCover}>
      <Bar className={style.topBar}>
        <ButtonPageMore isCoverPage={true} />
      </Bar>
      <Panels
        items={[
          {
            c: 12,
            cs: 0,
            r: 10,
            rs: 0,
            content: (
              <img
                className={style.image}
                src={getImage(imageBlob)}
                loading="lazy"
              />
            ),
            className: "image",
          },
          {
            c: 12,
            cs: 0,
            r: 2,
            rs: 10,
            content: <p className={style.title}>{title}</p>,
            className: "text",
          },
        ]}
      />
    </div>
  );
};

export default PageCover;
