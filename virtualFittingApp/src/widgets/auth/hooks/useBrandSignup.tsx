import { type ChangeEvent, useState } from "react";
import { BrandUserSignUpRequestDto } from "../types/login";
import {
  brandUserSignUpApi,
  updateUserInfo,
  uploadBusinessRegistration,
} from "../api/brandAuth.action";
import { useNavigate } from "react-router-dom";
import { FileItem } from "@/shared";
import { isAxiosError } from "axios";

// onChange 함수들 조금 더 깔끔하게 보낼 수 있도록 설정
// page layer 에서 너무 많은 prop 을 전달한다.

function useBrandSignup() {
  const router = useNavigate();

  const [brandUserSignUp, setBrandUserSignUp] =
    useState<BrandUserSignUpRequestDto>({
      id: "",
      password: "",
      userGrade: "BRONZE",
      emailAddress: "",
      loginType: "",
      phoneNumber: "",
      userImageUrl: "",
      userProfileImageUrl: "",
      firmName: "",
      firmAddress: "",
      firmWebUrl: "",
      businessRegistration: "",
      businessRegistrationCertificateImageUrl: "",
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

  const onChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setBrandUserSignUp({
      ...brandUserSignUp,
      phoneNumber: e.target.value,
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

      setStateMsg("upload");
      if (businessRegistration.length > 0) {
        const uploadRes =
          await uploadBusinessRegistration(businessRegistration);
        if (!uploadRes) throw new Error("사진 업로드 실패");
      }

      setStateMsg("update");
      const updateRes = await updateUserInfo(brandUserSignUp);
      if (!updateRes) throw new Error("회원정보 수정 실패");

      setStateMsg("complete");
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
    onChangePhoneNumber,
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
