import style from "./style.module.css";
import Button from "../../components/Button";

const SignIn = () => {
  return (
    <div className={style.signIn}>
      <span className={style.stella}>Stella</span>
      <span className={style.signInWidth}>Sign in with</span>
      <div className={style.signInOptions}>
        <Button className={style.signInOption}>Google</Button>
        <Button className={style.signInOption}>Facebook</Button>
        <Button className={style.signInOption}>Apple</Button>
      </div>
    </div>
  );
};

export default SignIn;
