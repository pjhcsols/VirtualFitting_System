import { type ChangeEvent, useState } from "react";

import { BrandUserType } from "@/pages/brand";
import { isBrandUserKey, isPhoneNumber } from "@/pages/auth/utils/type";
import { validateEmail } from "@/pages/auth/utils/validation";
import { TPhoneNumerPart } from "@/pages/brand/types/brandUser";
import { signUpBrand } from "../api/brand.action";

function useBrand() {
  const [step, setStep] = useState<number>(0);
  const [user, setUser] = useState<BrandUserType>({
    userNumber: 0,
    id: "",
    password: "",
    emailAddress: "",
    loginType: "NORMAL",
    userGrade: "BRONZE",
    phoneNumber: "",
    firmAddress: "",
    firmEmail: "",
    firmName: "",
    businessRegistration: "",
    businessRegistrationCertificateImageUrl: "",
    firmPhone: "",
    firmWebUrl: "",
    userImageUrl: "",
    userProfileImageUrl: "",
    saleAllowed: false,
  });
  const [phoneNumber, setPhoneNumber] = useState<TPhoneNumerPart>({
    prefix: "",
    middle: "",
    suffix: "",
  });
  const [firmPhoneNumber, setFirmPhoneNumber] = useState<TPhoneNumerPart>({
    prefix: "",
    middle: "",
    suffix: "",
  });
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const prev = () => {
    if (step <= 0) {
      return;
    }
    setStep((prev) => prev - 1);
  };

  const next = () => {
    if (step >= 2) {
      return;
    }
    setStep((prev) => prev + 1);
  };

  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isBrandUserKey(name)) {
      return;
    }
    if (name === "emailAddress" && !validateEmail(value)) {
      setErrMsg("이메일 형식에 맞지 않습니다.");
    }
    setUser({
      ...user,
      [name]: value,
    });
  };

  const onChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isPhoneNumber(name)) {
      return;
    }
    setPhoneNumber({
      ...phoneNumber,
      [name]: value,
    });
  };

  const onChangeFirmPhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isPhoneNumber(name)) {
      return;
    }
    setFirmPhoneNumber({
      ...firmPhoneNumber,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    try {
      await signUpBrand({ user, phoneNumber, firmPhoneNumber });
    } catch (err) {
      if (err instanceof CustomException) {
      }
    }
  };

  return {
    user,
    step,
    errMsg,
    onSubmit,
    prev,
    next,
    onChangeText,
    onChangePhoneNumber,
    onChangeFirmPhoneNumber,
  };
}

export { useBrand };
