import { ArrowLeft } from "react-feather";
import Button from "../../components/Button";
import { useGlobalContext } from "../../context/context";

const ButtonBack = () => {
  const { dispatch } = useGlobalContext();
  return (
    <Button
      onClick={() => {
        dispatch({ type: "SET_MENU", payload: <h1>Menu</h1> });
      }}
    >
      <ArrowLeft height={18} color="#444" />
    </Button>
  );
};

export default ButtonBack;
