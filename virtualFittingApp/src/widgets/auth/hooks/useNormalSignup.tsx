import { type ChangeEvent, useState } from "react";
import type { NormalUserSignUpRequestDto } from "../types/login";
import { NormalUserSignUp } from "../api/normalAuth.action";
import { useNavigate } from "react-router-dom";

function useNormalSignUp() {
  const router = useNavigate();

  const [signUpInfo, setSignUpInfo] = useState<NormalUserSignUpRequestDto>({
    id: "",
    password: "",
    emailAddress: "",
    phoneNumber: "",
    name: "",
    nickname: "",
    gender: "MALE",
    birthDate: "",
    address: "",
    totalLength: 0,
    chest: 0,
    shoulder: 0,
    arm: 0,
    pantsTotalLength: 0,
    waistWidth: 0,
    hipWidth: 0,
    thighWidth: 0,
    rise: 0,
    hemWidth: 0,
    height: 0,
    weight: 0,
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "signupId":
        setSignUpInfo({
          ...signUpInfo,
          ["id"]: value,
        });
        break;
      case "password":
        setSignUpInfo({
          ...signUpInfo,
          [name]: value,
        });
        break;
      case "gender":
        setSignUpInfo({
          ...signUpInfo,
          [name]: "MALE",
        });
        break;
      case "phoneNumber":
      case "name":
      case "nickname":
      case "address":
      case "emailAddress":
      case "birthDate":
        setSignUpInfo({
          ...signUpInfo,
          [name]: value,
        });
        break;
      case "totalLength":
      case "chest":
      case "shoulder":
      case "arm":
      case "pantsTotalLength":
      case "waistWidth":
      case "hipWidth":
      case "thighWidth":
      case "rise":
      case "hemWidth":
      case "height":
      case "width":
        setSignUpInfo({
          ...signUpInfo,
          [name]: parseInt(value),
        });
        break;
    }
  };

  const onSubmitSignUp = async () => {
    const res = await NormalUserSignUp(signUpInfo);
    if (res) {
      alert("회원가입에 성공했습니다!");
      router("/store");
    }
  };

  const onClickHome = () => {
    router("/");
  };

  return {
    signUpInfo,
    onChange,
    onSubmitSignUp,
    onClickHome,
  };
}

export { useNormalSignUp };
