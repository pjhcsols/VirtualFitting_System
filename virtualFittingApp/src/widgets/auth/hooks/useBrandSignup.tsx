import { type ChangeEvent, useState } from "react";
import { BrandUserSignUpRequestDto } from "../types/login";
import { brandUserSignUpApi } from "../api/brandAuth.action";
import { useNavigate } from "react-router-dom";
import { FileItem } from "@/shared";
import { isAxiosError } from "axios";

function useBrandSignup() {
  const router = useNavigate();

  const [brandUserSignUp, setBrandUserSignUp] =
    useState<BrandUserSignUpRequestDto>({
      userNumber: 0,
      id: "",
      password: "",
      emailAddress: "",
      phoneNumber: "",
      userGrade: "BRONZE",
      loginType: "NORMAL",
      userImageUrl: "",
      userProfileImageUrl: "",
      firmName: "",
      firmAddress: "",
      businessRegistration: "",
      businessRegistrationCertificateImageUrl: null,
      firmWebUrl: "",
      firmEmail: "",
      firmPhone: "",
      saleAllowed: false,
    });
  const [businessRegistration, setBusinessRegistration] = useState<FileItem[]>(
    [],
  );
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [stateMsg, setStateMsg] = useState<
    "idle" | "signUp" | "upload" | "update" | "complete"
  >("idle");

  const onChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setBrandUserSignUp({
      ...brandUserSignUp,
      id: e.target.value,
    });
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setBrandUserSignUp({
      ...brandUserSignUp,
      password: e.target.value,
    });
  };

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setBrandUserSignUp({
      ...brandUserSignUp,
      emailAddress: e.target.value,
    });
  };

  const onChangeRegistration = (e: ChangeEvent<HTMLInputElement>) => {
    setBrandUserSignUp({
      ...brandUserSignUp,
      businessRegistration: e.target.value,
    });
  };

  const onChangeFirmName = (e: ChangeEvent<HTMLInputElement>) => {
    setBrandUserSignUp({
      ...brandUserSignUp,
      firmName: e.target.value,
    });
  };

  const onChangeFirmAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setBrandUserSignUp({
      ...brandUserSignUp,
      firmAddress: e.target.value,
    });
  };

  const onChangeFirmWebUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setBrandUserSignUp({
      ...brandUserSignUp,
      firmWebUrl: e.target.value,
    });
  };

  const onChangeFirmEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setBrandUserSignUp({
      ...brandUserSignUp,
      firmEmail: e.target.value,
    });
  };

  const onChangeFirmPhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setBrandUserSignUp({
      ...brandUserSignUp,
      firmPhone: e.target.value,
    });
  };

  const onSubmitSignUp = async () => {
    try {
      setStateMsg("signUp");
      const signUpRes = await brandUserSignUpApi(brandUserSignUp);
      if (!signUpRes) throw new Error("회원가입 실패");
      router("/login");
    } catch (err) {
      if (!isAxiosError(err)) {
        console.error(err);
        return;
      }
      alert(err.message || "서버 오류 발생");
      setStateMsg("idle");
    }
  };

  const onClickNextStep = () => {
    if (step === 1) {
      setStep(2);
    }
    if (step === 0) {
      setStep(1);
    }
  };

  const onClickPrevStep = () => {
    setStep(0);
  };

  const onClickCancel = () => {
    router("/login");
  };

  return {
    brandUserSignUp,
    setBrandUserSignUp,
    step,
    businessRegistration,
    stateMsg,
    setBusinessRegistration,
    onSubmitSignUp,
    onClickNextStep,
    onClickPrevStep,
    onChangeId,
    onChangePassword,
    onChangeEmail,
    onChangeRegistration,
    onChangeFirmName,
    onChangeFirmAddress,
    onChangeFirmWebUrl,
    onChangeFirmEmail,
    onChangeFirmPhoneNumber,
    onClickCancel,
  };
}

export { useBrandSignup };
