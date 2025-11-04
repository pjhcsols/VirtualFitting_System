import { type ChangeEvent, useState } from "react";

import { BrandUserType } from "@/pages/brand";
import { isBrandUserKey } from "@/pages/auth/utils/type";
import { validateEmail, validatePassword } from "@/pages/auth/utils/validation";
import { signUpBrand } from "../api/brand.action";
import { useNavigate } from "react-router-dom";

function useBrand() {
  const router = useNavigate();
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
  const [phone, setPhone] = useState<string>("");
  const [firmPhone, setFirmPhone] = useState<string>("");
  const [registration, setRegistration] = useState<string>("");
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
    if (name === "password") {
      const result = validatePassword(value);
      if (!result.isValid) {
        setErrMsg(result.message);
      }
    }
    if (name === "emailAddress" && !validateEmail(value)) {
      setErrMsg("이메일 형식에 맞지 않습니다.");
    }
    setUser({
      ...user,
      [name]: value,
    });
  };

  const onSubmit = async () => {
    try {
      setUser({
        ...user,
        firmPhone: firmPhone,
        phoneNumber: phone,
        businessRegistration: registration,
      });
      await signUpBrand({
        user,
        phone,
        firmPhone,
        businessRegistration: registration,
      });
      router("/products");
    } catch (err) {
      if (err instanceof CustomException) {
      }
    }
  };

  return {
    user,
    step,
    errMsg,
    phone,
    setPhone,
    firmPhone,
    setFirmPhone,
    registration,
    setRegistration,
    onSubmit,
    prev,
    next,
    onChangeText,
  };
}

export { useBrand };
