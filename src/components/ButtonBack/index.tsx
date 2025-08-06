"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "react-feather";

import Button from "../../components/Button";

const ButtonBack = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.back();
      }}
    >
      <ArrowLeft height={18} color="#444" />
    </Button>
  );
};

export default ButtonBack;
