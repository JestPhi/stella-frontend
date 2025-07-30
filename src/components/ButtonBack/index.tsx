import { useNavigate } from "react-router";
import { ArrowLeft } from "react-feather";

import Button from "../../components/Button";

const ButtonBack = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        navigate(-1);
      }}
    >
      <ArrowLeft height={18} color="#444" />
    </Button>
  );
};

export default ButtonBack;
