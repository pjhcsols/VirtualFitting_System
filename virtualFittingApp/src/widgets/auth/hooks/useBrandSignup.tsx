import { type ChangeEvent, useState } from "react";
import { BrandUserSignUpRequestDto } from "../types/login";
import { BrandUserSignUp } from "../api/brandAuth.action";
import { useNavigate } from "react-router-dom";

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
      firmEmail: "",
      firmPhone: "",
    });
  const [businessRegistration, setBusinessRegistration] = useState<File>();
  const [step, setStep] = useState<0 | 1>(0);

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

  const onChangeUserImageUrl = () => {};

  const onChangeUserProfileImageUrl = () => {};

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

  const onChnageBusinessRegistration = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files === null) {
      return;
    }
    const file = files[0];
    setBusinessRegistration(file);
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
    const res = await BrandUserSignUp(brandUserSignUp);
    if (res === true) {
      return res;
    }
    alert("서버 오류 발생");
  };

  const onClickNextStep = () => {
    setStep(1);
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
    onSubmitSignUp,
    onClickNextStep,
    onClickPrevStep,
    onChangeId,
    onChangePassword,
    onChangeEmail,
    onChangePhoneNumber,
    onChangeFirmName,
    onChangeFirmAddress,
    onChangeFirmWebUrl,
    onChnageBusinessRegistration,
    onChangeFirmEmail,
    onChangeFirmPhoneNumber,
    onClickCancel,
  };
}

export { useBrandSignup };
