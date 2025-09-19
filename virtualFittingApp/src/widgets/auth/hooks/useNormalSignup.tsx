import { type ChangeEvent, useState } from "react";
import type { NormalUserSignUpRequestDto } from "../types/login";
import { NormalUserSignUp } from "../api/normalAuth.action";
import { useNavigate } from "react-router-dom";
import { Dayjs } from "dayjs";

function useNormalSignUp() {
  const router = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState({
    part1: "",
    part2: "",
    part3: "",
  });

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

  const onChangePhoneNumber = (
    name: string,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    if (!isStrictInteger(value) && value.length != 0) {
      return;
    }
    if (name === "part1") {
      setPhoneNumber({
        ...phoneNumber,
        ["part1"]: value,
      });
    }
    if (name === "part2") {
      setPhoneNumber({
        ...phoneNumber,
        ["part2"]: value,
      });
    }
    if (name === "part3") {
      setPhoneNumber({
        ...phoneNumber,
        ["part3"]: value,
      });
    }
  };

  const onChangeDatePicker = (value: Dayjs | null) => {
    if (value === null) {
      return;
    }
    console.log(value.utcOffset.toString());
    setSignUpInfo({
      ...signUpInfo,
      birthDate: value.utcOffset.toString() ?? "",
    });
  };

  const onClickGender = (gender: "MALE" | "FEMALE") => {
    setSignUpInfo({
      ...signUpInfo,
      ["gender"]: gender,
    });
  };

  const onSubmitSignUp = async () => {
    setSignUpInfo({
      ...signUpInfo,
      ["phoneNumber"]:
        phoneNumber.part1 + phoneNumber.part2 + phoneNumber.part3,
    });
    const res = await NormalUserSignUp(signUpInfo);
    console.log(res);
    if (res === 201) {
      router("/signup/success");
      return;
    }
    router("/signup/failed");
  };

  const isStrictInteger = (str: string) => {
    return /^-?\d+$/.test(str);
  };

  return {
    signUpInfo,
    phoneNumber,
    onClickGender,
    onChangePhoneNumber,
    onChangeDatePicker,
    onChange,
    onSubmitSignUp,
  };
}

export { useNormalSignUp };
