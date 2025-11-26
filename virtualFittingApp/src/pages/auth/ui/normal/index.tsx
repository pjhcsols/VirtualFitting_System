import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import React, { useState, useEffect, useRef  } from "react";
import { TNormalUser } from "../../types/auth";
import ReactLenis, { type LenisRef } from "lenis/react";
import { GlassBox } from "@/shared/components/glass-box";
import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import { Starfield } from "@/shared/components/star";
import { TransparentHeader } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { signUpNormal } from "../../api/normal.action";
import { useNavigate } from "react-router-dom";
import { GlassButton } from "@/shared/components/glass-button";

gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(ScrollTrigger);

const InputField = ({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  required = true,
  step,
  span = 2,
  error,
}: {
  name: string;
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  step?: string;
  span?: number;
  error?: string;
}) => {
  const wrapperClassName = span === 2 ? "md:col-span-2" : "";
  
  const baseClasses =
    "w-full px-3 py-2 bg-transparent border rounded-full text-sm text-white placeholder:text-gray-400 focus:outline-none";

  const conditionalClasses = error
    ? "border-red-500 focus:border-red-500"
    : `${
        value ? "border-white" : "border-white/30"
      } focus:border-white`;

  const inputClassName = `${baseClasses} ${conditionalClasses}`;

  return (
    <div className={wrapperClassName}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        step={step}
        required={required}
        className={inputClassName}
      />
      {error && (
        <p
          className="text-red-500 text-left mt-1 pl-4"
          style={{ fontSize: "13px" }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

function UserInfoForm() {
  const lenisRef = useRef<LenisRef>(null);
  const router = useNavigate();
  const [idError, setIdError] = useState<string>("");
  const [showSizes, setShowSizes] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState("gmail.com");
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [genderError, setGenderError] = useState("");

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  useEffect(() => {
    if (!emailLocal && !isCustomDomain) {
      setFormData(prev => ({...prev, emailAddress: ""}));
      setEmailError("");
      return;
    }

    const fullEmail = `${emailLocal}@${emailDomain}`;
    setFormData(prev => ({...prev, emailAddress: fullEmail}));
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fullEmail)) {
        setEmailError("유효하지 않은 이메일 형식입니다.");
    } else {
        setEmailError("");
    }
  }, [emailLocal, emailDomain, isCustomDomain]);

  const [formData, setFormData] = useState<TNormalUser>({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "id") {
      const LOGIN_ALLOWED = /^[A-Za-z0-9]{6,20}$/;
      if (value && !LOGIN_ALLOWED.test(value)) {
        setIdError("아이디는 영문과 숫자로 6~20자 이내로 입력해주세요.");
      } else {
        setIdError("");
      }
    } else if (name === "password") {
      const PW_MIN_MAX = /^.{8,16}$/;
      const PW_UPPERCASE = /[A-Z]/;
      const PW_LOWERCASE = /[a-z]/;
      const PW_DIGIT = /\d/;
      const PW_SPECIAL = /[!@#$%^&*()\-_=+\[\]{}|;:'",.<>/?]/;

      let errorMessage = "";

      if (value) {
        if (!PW_MIN_MAX.test(value)) {
          errorMessage = "비밀번호는 8~16자여야 합니다.";
        } else if (!PW_UPPERCASE.test(value)) {
          errorMessage = "비밀번호에 대문자를 포함하세요.";
        } else if (!PW_LOWERCASE.test(value)) {
          errorMessage = "비밀번호에 소문자를 포함하세요.";
        } else if (!PW_DIGIT.test(value)) {
          errorMessage = "비밀번호에 숫자를 포함하세요.";
        } else if (!PW_SPECIAL.test(value)) {
          errorMessage = "비밀번호에 특수문자를 포함하세요.";
        }
      }
      setPasswordError(errorMessage);
    } else if (name === "phoneNumber") {
      const input = value.replace(/[^0-9]/g, "");

      let formattedInput = "";
      if (input.length > 10) {
        formattedInput = input.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      } else if (input.length > 6) {
        formattedInput = input.replace(/(\d{3})(\d{4})(\d{1,})/, '$1-$2-$3');
      } else if (input.length > 2) {
        formattedInput = input.replace(/(\d{3})(\d{1,})/, '$1-$2');
      } else {
        formattedInput = input;
      }
      
      if (formattedInput.length > 13) {
          formattedInput = formattedInput.substring(0, 13);
      }

      let errorMessage = "";
      if (input.length > 0) {
        if (input.length < 10 || input.length > 11) {
          errorMessage = "전화번호는 10~11자리 숫자입니다.";
        } else if (!/^01[0-9]\d{7,8}$/.test(input) && !/^0\d{1,2}\d{7,8}$/.test(input)) {
             errorMessage = "유효하지 않은 전화번호 형식입니다.";
        }
      }
      setPhoneError(errorMessage);

      setFormData((prev) => ({ ...prev, phoneNumber: formattedInput }));
      return;
    } else if (['name', 'nickname', 'birthDate', 'address', 'gender'].includes(name)) {
      let currentErrorSetter: React.Dispatch<React.SetStateAction<string>> | undefined;
      switch (name) {
        case 'name':
          currentErrorSetter = setNameError;
          break;
        case 'nickname':
          currentErrorSetter = setNicknameError;
          break;
        case 'birthDate':
          currentErrorSetter = setBirthDateError;
          break;
        case 'address':
          currentErrorSetter = setAddressError;
          break;
        case 'gender':
          currentErrorSetter = setGenderError;
          break;
      }
      if (currentErrorSetter) {
          if (!value.trim()) {
              currentErrorSetter("필수 입력 항목입니다.");
          } else {
              currentErrorSetter("");
          }
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: [
        "totalLength",
        "chest",
        "shoulder",
        "arm",
        "pantsTotalLength",
        "waistWidth",
        "hipWidth",
        "thighWidth",
        "rise",
        "hemWidth",
        "height",
        "weight",
      ].includes(name)
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    await signUpNormal({ user: formData });
    router("/login");
  };

  const commonInputProps = (name: keyof TNormalUser) => ({
    name,
    value: formData[name],
    onChange: handleChange,
  });

  const numericInputProps = (name: keyof TNormalUser) => ({
    name,
    value: formData[name] === 0 ? "" : formData[name],
    onChange: handleChange,
    type: "number",
    step: "0.1",
  });

  return (
    <Wrapper
      options={{ smoothWheel: true, autoRaf: false }}
      ref={lenisRef}
      root
    >
      <Starfield theme="light" />
      <TransparentHeader />
      <MainSection>
        <Section>
          <GlassBoxStyled>
            <TitleText>일반회원 가입하기</TitleText>
            <div className="max-w-4xl mx-auto p-6 rounded-lg ">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      {...commonInputProps("id")}
                      placeholder="아이디"
                      error={idError}
                    />
                    <div className="md:col-span-2 flex flex-col">
                      <div className="relative flex items-center">
                        <input
                          name="password"
                          placeholder="비밀번호"
                          value={formData.password}
                          onChange={handleChange}
                          type={isPasswordVisible ? 'text' : 'password'}
                          required
                          className={`w-full pl-3 pr-12 py-2 bg-transparent border rounded-full text-sm text-white placeholder:text-gray-400 focus:outline-none ${
                            passwordError
                              ? 'border-red-500 focus:border-red-500'
                              : `${formData.password ? 'border-white' : 'border-white/30'} focus:border-white`
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setIsPasswordVisible((prev) => !prev)}
                          className="absolute right-0 mr-4"
                          aria-label="Toggle password visibility"
                        >
                          <img
                            src={
                              isPasswordVisible
                                ? '/svg/eye-open.svg'
                                : '/svg/eye-closed.svg'
                            }
                            alt="Password visibility toggle"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                      {passwordError && (
                        <p
                          className="text-red-500 text-left mt-1 pl-4"
                          style={{ fontSize: "13px" }}
                        >
                          {passwordError}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                        <input
                          type="text"
                            className={`w-full px-3 py-2 bg-transparent border rounded-full text-sm text-white placeholder:text-gray-400 focus:outline-none ${emailError ? 'border-red-500 focus:border-red-500' : 'border-white/30 focus:border-white'}`}
                            value={emailLocal}
                            onChange={(e) => setEmailLocal(e.target.value)}
                            placeholder="이메일"
                        />
                          <span className="text-white text-center">@</span>
                          {isCustomDomain ? (
                            <input
                              type="text"
                              className={`w-full px-3 py-2 bg-transparent border rounded-full text-sm text-white placeholder:text-gray-400 focus:outline-none ${emailError ? 'border-red-500 focus:border-red-500' : 'border-white/30 focus:border-white'}`}
                              value={emailDomain}
                              onChange={(e) => setEmailDomain(e.target.value)}
                              placeholder="직접 입력"
                            />
                          ) : (
                            <select
                              className={`w-full px-3 py-2 bg-transparent border rounded-full text-sm text-white focus:outline-none ${emailError ? 'border-red-500 focus:border-red-500' : 'border-white/30 focus:border-white'}`}
                              value={emailDomain}
                              onChange={(e) => {
                                if (e.target.value === 'custom') {
                                  setIsCustomDomain(true);
                                  setEmailDomain("");
                                } else {
                                  setIsCustomDomain(false);
                                  setEmailDomain(e.target.value);
                                }
                                }}
                              >
                              <option className="text-black" value="gmail.com">gmail.com</option>
                              <option className="text-black" value="naver.com">naver.com</option>
                              <option className="text-black" value="daum.net">daum.net</option>
                              <option className="text-black" value="hanmail.net">hanmail.net</option>
                              <option className="text-black" value="nate.com">nate.com</option>
                              <option className="text-black" value="custom">직접 입력</option>
                              </select>
                          )}
                      </div>
                      {emailError && <p className="text-red-500 text-left mt-1 pl-4" style={{ fontSize: "13px" }}>{emailError}</p>}
                    </div>
                    <InputField
                      {...commonInputProps("phoneNumber")}
                      type="tel"
                      placeholder="전화번호"
                      error={phoneError}
                    />
                    <InputField
                      {...commonInputProps("name")}
                      placeholder="이름"
                      error={nameError}
                    />
                    <InputField
                      {...commonInputProps("nickname")}
                      placeholder="닉네임"
                      error={nicknameError}
                    />
                    <div className="md:col-span-2">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 bg-transparent border rounded-full text-sm focus:outline-none focus:border-white ${genderError ? 'border-red-500' : formData.gender ? "border-white" : "border-white/30"} ${!formData.gender ? 'text-gray-400' : 'text-white'}`}
                        required
                      >
                        <option className="text-black" value="MALE">남성</option>
                        <option className="text-black" value="FEMALE">여성</option>
                      </select>
                      {genderError && <p className="text-red-500 text-left mt-1 pl-4" style={{ fontSize: "13px" }}>{genderError}</p>}
                    </div>
                    <InputField
                      {...commonInputProps("birthDate")}
                      type="date"
                      placeholder="생년월일"
                      error={birthDateError}
                    />
                    <InputField
                      {...commonInputProps("address")}
                      placeholder="주소"
                      error={addressError}
                    />
                  </div>
                </div>
                <div className="w-full flex justify-start items-start group cursor-pointer" onClick={() => setShowSizes((prev) => !prev)}>
                  <h3
                    className="flex justify-between items-center w-full text-lg font-semibold mb-4 text-white group-hover:-translate-y-1 duration-200"
                  >
                    <span>사이즈 정보</span>
                    <img src="/svg/ChevronDown.svg" alt="toggle size info" className={`w-6 h-6 transition-transform duration-200 ${showSizes ? 'rotate-180' : ''}`} />
                  </h3>
                </div>
                {showSizes && (
                  <>
                    <div className="pb-6">
                      <h3 className="text-lg font-semibold mb-4 text-white text-left">
                        신체 정보
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          {...numericInputProps("height")}
                          placeholder="키 (cm)"
                          span={1}
                        />
                        <InputField
                          {...numericInputProps("weight")}
                          placeholder="몸무게 (kg)"
                          span={1}
                        />
                      </div>
                    </div>

                    <div className="pb-6">
                      <h3 className="text-lg font-semibold mb-4 text-white text-left">
                        상의
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          {...numericInputProps("totalLength")}
                          placeholder="총장(cm)"
                          span={1}
                        />
                        <InputField
                          {...numericInputProps("chest")}
                          placeholder="가슴둘레(cm)"
                          span={1}
                        />
                        <InputField
                          {...numericInputProps("shoulder")}
                          placeholder="어깨너비(cm)"
                          span={1}
                        />
                        <InputField
                          {...numericInputProps("arm")}
                          placeholder="팔길이(cm)"
                          span={1}
                        />
                      </div>
                    </div>

                    <div className="pb-6">
                      <h3 className="text-lg font-semibold mb-4 text-white text-left">
                        하의
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          {...numericInputProps("pantsTotalLength")}
                          placeholder="바지 총장(cm)"
                          span={1}
                        />
                        <InputField
                          {...numericInputProps("waistWidth")}
                          placeholder="허리둘레(cm)"
                          span={1}
                        />
                        <InputField
                          {...numericInputProps("hipWidth")}
                          placeholder="엉덩이둘레(cm)"
                          span={1}
                        />
                        <InputField
                          {...numericInputProps("thighWidth")}
                          placeholder="허벅지둘레(cm)"
                          span={1}
                        />
                        <InputField
                          {...numericInputProps("rise")}
                          placeholder="밑위(cm)"
                          span={1}
                        />
                        <InputField
                          {...numericInputProps("hemWidth")}
                          placeholder="밑단너비(cm)"
                          span={1}
                        />
                      </div>
                    </div>
                  </>
                )}
                <GlassButton
                  width="100%"
                  size="large"
                >
                  가입하기
                </GlassButton>
              </form>
            </div>
          </GlassBoxStyled>
        </Section>
        <Footer />
      </MainSection>
    </Wrapper>
  );
}

const Wrapper = styled(ReactLenis)``;
const MainSection = styled.section`
  box-sizing: border-box;
  min-height: 100vh;
  width: 100%;
  padding: 5rem;
  transition: 0.3s padding ease-out;
  background: radial-gradient(
    circle at 15% 25%,
    #292e49 0%,
    #536976 60%,
    #bbd2c5 100%
  );
  display: flex;
  flex-direction: column; 
  justify-content: space-between;
  overflow-x: hidden;
  text-align: center;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 2rem 1rem;
  }
`;

const GlassBoxStyled = styled(GlassBox)`
  flex: 1;
  padding: 2rem;
  width: 800px;
  height: 600px;

  @media (max-width: 1200px) {
    width: 80%;
    max-width: 500px;
  }
`;

const TitleText = styled.h2`
  font-size: 3rem;
  padding: 2rem;
  font-weight: 700;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 36px;
  }
`;

const Section = styled.div`
  box-sizing: border-box;
  width: 100%;
  flex-grow: 1; 
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem; 
  
  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 4rem 1rem;
  }
`;

export { UserInfoForm };
