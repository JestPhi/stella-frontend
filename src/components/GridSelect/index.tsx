import style from "./style.module.css";
import Grid from "../Grid";

const GridSelect = () => {
  return (
    <div className={style.gridSelect}>
      <Grid cols={1} rows={1} />
      <Grid cols={2} rows={1} />
      <Grid cols={3} rows={1} />
      <Grid cols={1} rows={2} />
      <Grid cols={2} rows={2} />
      <Grid cols={3} rows={2} />
      <Grid cols={1} rows={3} />
      <Grid cols={2} rows={3} />
      <Grid cols={3} rows={3} />
    </div>
  );
};

export default GridSelect;
