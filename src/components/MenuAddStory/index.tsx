import style from "./style.module.css";
import { useGlobalContext } from "../../context/context";
import InputImage from "../InputImage";
import Textarea from "../TextArea";
import Divider from "../Divider";

const MenuAddStory = ({ heading }) => {
  const { dispatch, state } = useGlobalContext();

  return (
    <div>
      <InputImage />
      <Divider />
      <Textarea rows={12} />
    </div>
  );
};

export default MenuAddStory;
