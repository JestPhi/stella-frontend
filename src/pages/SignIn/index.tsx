import style from "./style.module.css";
import Button from "../../components/Button";
import { useAuthContext } from "../../context/auth";

const SignIn = () => {
  const { signIn } = useAuthContext();
  return (
    <div className={style.signIn}>
      <span className={style.stella}>Stella</span>
      <span className={style.signInWidth}>Sign in with</span>
      <div className={style.signInOptions}>
        <Button className={style.signInOption} onClick={signIn}>
          Google
        </Button>
        <Button className={style.signInOption}>Facebook</Button>
        <Button className={style.signInOption}>Apple</Button>
      </div>
    </div>
  );
};

export default SignIn;
