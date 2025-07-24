import style from "./style.module.css";
import Grid from "../Panels";

const GridSelect = () => {
  return (
    <>
      1 Panel
      <div className={style.gridSelect}>
        <Grid items={[{ c: 12, r: 12, rs: 0, cs: 0 }]} />
      </div>
      2 Panel
      <div className={style.gridSelect}>
        <Grid
          items={[
            { c: 12, r: 9, rs: 0, cs: 0 },
            { c: 12, r: 3, rs: 9, cs: 0 },
          ]}
        />
        <Grid
          items={[
            { c: 12, r: 8, rs: 0, cs: 0 },
            { c: 12, r: 4, rs: 8, cs: 0 },
          ]}
        />
        <Grid
          items={[
            { c: 12, r: 6, rs: 0, cs: 0 },
            { c: 12, r: 6, rs: 6, cs: 0 },
          ]}
        />
        <Grid
          items={[
            { c: 12, r: 3, rs: 0, cs: 0 },
            { c: 12, r: 9, rs: 3, cs: 0 },
          ]}
        />
        <Grid
          items={[
            { c: 6, r: 12, rs: 0, cs: 0 },
            { c: 6, r: 12, rs: 0, cs: 6 },
          ]}
        />
        <Grid
          items={[
            { c: 12, r: 4, rs: 0, cs: 0 },
            { c: 12, r: 8, rs: 4, cs: 6 },
          ]}
        />
      </div>
      3 Panel
      <div className={style.gridSelect}>
        <Grid
          items={[
            { c: 12, r: 4, rs: 0, cs: 0 },
            { c: 12, r: 4, rs: 4, cs: 0 },
            { c: 12, r: 4, rs: 8, cs: 0 },
          ]}
        />
        <Grid
          items={[
            { c: 6, r: 4, rs: 0, cs: 0 },
            { c: 6, r: 4, rs: 0, cs: 6 },
            { c: 12, r: 8, rs: 8, cs: 0 },
          ]}
        />
        <Grid
          items={[
            { c: 6, r: 6, rs: 0, cs: 0 },
            { c: 6, r: 6, rs: 0, cs: 6 },
            { c: 12, r: 6, rs: 6, cs: 0 },
          ]}
        />
      </div>
      4 Panel
      <div className={style.gridSelect}>
        <Grid
          items={[
            { c: 6, r: 6, rs: 0, cs: 0 },
            { c: 6, r: 6, rs: 0, cs: 6 },
            { c: 6, r: 6, rs: 6, cs: 0 },
            { c: 6, r: 6, rs: 6, cs: 6 },
          ]}
        />
        <Grid
          items={[
            { c: 6, r: 12, rs: 0, cs: 0 },
            { c: 6, r: 4, rs: 0, cs: 6 },
            { c: 6, r: 4, rs: 4, cs: 6 },
            { c: 6, r: 4, rs: 8, cs: 6 },
          ]}
        />
      </div>
    </>
  );
};

export default GridSelect;
