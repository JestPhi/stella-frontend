import { useNavigate } from "react-router";
import style from "./style.module.css";
import Button from "../../components/Button";
import useAuth from "../../hooks/useAuth";
import { useGlobalContext } from "../../context/context";
import Bar from "../../components/Bar";
import ButtonBack from "../../components/ButtonBack";
import ButtonMenu from "../../components/ButtonProfile";
import MenuEditProfile from "../../components/MenuCreateProfile";
import { getStellaIdByFirebaseId } from "../../api";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { dispatch } = useGlobalContext();
  return (
    <div className={style.signIn}>
      <span className={style.stella}>Stella</span>
      <span className={style.signInWidth}>Sign in with</span>
      <div className={style.signInOptions}>
        <Button
          className={style.signInOption}
          onClick={async () => {
            const signInData = await signIn();
            console.log(signInData);
            dispatch({
              type: "SET_FIREBASE_ID",
              payload: signInData.user.uid,
            });

            const firebaseIdDoc = await getStellaIdByFirebaseId(
              signInData.user.uid
            );

            if (firebaseIdDoc.stellaId) {
              dispatch({
                type: "SET_STELLA_ID",
                payload: firebaseIdDoc.stellaId,
              });
              navigate("/");
              return;
            }

            try {
              dispatch({
                type: "SET_MENU",
                payload: {
                  template: <MenuEditProfile />,
                  heading: "Sign Up",
                },
              });
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Google
        </Button>
        <Button className={style.signInOption}>Facebook</Button>
        <Button className={style.signInOption}>Apple</Button>
      </div>
    </div>
  );
};

export default SignIn;
