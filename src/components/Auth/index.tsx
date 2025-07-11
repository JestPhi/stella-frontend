import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/auth";
import { useGlobalContext } from "../../context/context";
import { getUserByFirebaseId } from "../../api";
import MenuSignUp from "../MenuSignUp";

const Auth = ({ children }) => {
  const navigate = useNavigate();
  const authState = useAuthContext();
  const { dispatch } = useGlobalContext();

  // const user = getUser();
  const hasAuth = false; //!!authState?.auth;

  useEffect(() => {
    if (!hasAuth) {
      // navigate("/signin");
    }
  }, [hasAuth]);

  return <>{children}</>;
};

export default Auth;
