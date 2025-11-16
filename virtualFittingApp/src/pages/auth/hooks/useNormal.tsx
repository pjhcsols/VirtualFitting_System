import { type NormalUserType } from "@/entities/auth/types/normal.d";
import { ChangeEvent, useState } from "react";
import { signUpNormal } from "../api/normal.action";
import { useNavigate } from "react-router-dom";
import { isNormalUserKey } from "../utils/type";
import { validateEmail, validatePassword } from "../utils/validation";
import dayjs, { Dayjs } from "dayjs";

function useNormal() {
  const router = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [user, setUser] = useState<NormalUserType>({
    address: "",
    arm: 0,
    birthDate: "",
    chest: 0,
    emailAddress: "",
    gender: "MALE",
    height: 0,
    hemWidth: 0,
    hipWidth: 0,
    id: "",
    name: "",
    nickname: "",
    pantsTotalLength: 0,
    password: "",
    phoneNumber: "",
    rise: 0,
    shoulder: 0,
    thighWidth: 0,
    totalLength: 0,
    waistWidth: 0,
    weight: 0,
  });
  const [phone, setPhone] = useState<string>("");
  const [birthday, setBirthday] = useState<Dayjs | null>(dayjs(new Date()));

  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isNormalUserKey(name)) {
      return;
    }
    if (name === "password") {
      validatePassword(value);
    }
    if (name === "emailAddress" && !validateEmail(value)) {
    }
    setUser((prev) => ({
      ...prev,
      [name]:
        name.includes("Length") ||
        name.includes("Width") ||
        name === "chest" ||
        name === "shoulder" ||
        name === "arm" ||
        name === "rise" ||
        name === "height" ||
        name === "weight" ||
        name === "totalLength" ||
        name === "pantsTotalLength" ||
        name === "waistWidth" ||
        name === "hipWidth" ||
        name === "thighWidth" ||
        name === "hemWidth"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const prev = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const next = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const onSubmit = async () => {
    try {
      await signUpNormal({
        user,
        phone,
        birthday,
      });
      router("/products");
    } catch (err) {
      if (err instanceof CustomException) {
      }
    }
  };

  return {
    step,
    prev,
    next,
    user,
    phone,
    birthday,
    setPhone,
    setBirthday,
    onChangeText,
    onSubmit,
  };
}

export { useNormal };
