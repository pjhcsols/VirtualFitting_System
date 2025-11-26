import { ChangeEvent, useRef, useState } from "react";
import { Mail, Phone, Globe } from "lucide-react";
import { Starfield } from "@/shared/components/star";
import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import { GlassBox } from "@/shared/components/glass-box";
import { TransparentHeader } from "@/widgets/header";
import { ScrollTrigger } from "gsap/all";
import gsap from "gsap";
import ReactLenis, { LenisRef } from "lenis/react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/widgets/footer";
import { signUpBrand } from "../../api/brand.action";
import { validateBusiness } from "../../api/business.action";
import { TBrandUser } from "../../types/auth";

gsap.registerPlugin(ScrollTrigger);

function BrandSignUpPage() {
  const lenisRef = useRef<LenisRef>(null);
  const router = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<TBrandUser>({
    id: "",
    password: "",
    emailAddress: "",
    phoneNumber: "",
    firmName: "",
    firmAddress: "",
    businessRegistration: "",
    firmWebUrl: "",
    firmEmail: "",
    firmPhone: "",
    userImageUrl: "",
    businessRegistrationCertificateImageUrl: "",
    loginType: "",
    saleAllowed: true,
    userGrade: "BRONZE",
    userNumber: 0,
    userProfileImageUrl: "",
  });

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBusiness = async () => {
    const res = await validateBusiness(formData.businessRegistration);
    if (res) {
      alert("인증 성공");
    } else {
      alert("인증 실패");
    }
  };

  const handleSubmit = async () => {
    try {
      await signUpBrand({ user: formData });
    } catch (e) {
      console.log(e);
      alert("등록 실패");
      return;
    }
    router("/auth/login");
  };

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
            <TitleText>브랜드 회원 가입하기</TitleText>
            <ContentWrapper ref={contentRef} onWheel={handleWheel}>
              <FormSection>
                <SectionTitle>
                  <Dot color="#60a5fa" />
                  계정 정보
                </SectionTitle>
                <InputGrid>
                  <InputGroup>
                    <Label>아이디</Label>
                    <Input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="사용자 아이디"
                    />
                  </InputGroup>
                  <InputGroup>
                    <Label>비밀번호</Label>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                  </InputGroup>
                  <InputGroup>
                    <Label>이메일</Label>
                    <InputWithIcon>
                      <Mail className="icon" />
                      <Input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        placeholder="user@example.com"
                        style={{ paddingLeft: "2.75rem" }}
                      />
                    </InputWithIcon>
                  </InputGroup>
                  <InputGroup>
                    <Label>전화번호</Label>
                    <InputWithIcon>
                      <Phone className="icon" />
                      <Input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="010-0000-0000"
                        style={{ paddingLeft: "2.75rem" }}
                      />
                    </InputWithIcon>
                  </InputGroup>
                </InputGrid>
              </FormSection>
              <FormSection>
                <SectionTitle>
                  <Dot color="#c084fc" />
                  회사 정보
                </SectionTitle>
                <InputGrid>
                  <InputGroup>
                    <Label>회사명</Label>
                    <Input
                      type="text"
                      name="firmName"
                      value={formData.firmName}
                      onChange={handleChange}
                      placeholder="회사 이름"
                    />
                  </InputGroup>
                  <InputGroup>
                    <Label>사업자등록번호</Label>
                    <Input
                      type="text"
                      name="businessRegistration"
                      value={formData.businessRegistration}
                      onChange={handleChange}
                      placeholder="000-00-00000"
                    />
                    <div
                      className="absolute w-20 h-9 rounded-xl bottom-2 right-0 flex justify-center items-center bg-white duration-200 hover:-translate-x-1 z-10 cursor-pointer"
                      onClick={handleBusiness}
                    >
                      <ButtonText>확인</ButtonText>
                    </div>
                  </InputGroup>
                  <InputGroup style={{ gridColumn: "1 / -1" }}>
                    <Label>회사 주소</Label>
                    <Input
                      type="text"
                      name="firmAddress"
                      value={formData.firmAddress}
                      onChange={handleChange}
                      placeholder="회사 주소를 입력하세요"
                    />
                  </InputGroup>
                  <InputGroup>
                    <Label>회사 웹사이트</Label>
                    <InputWithIcon>
                      <Globe className="icon" />
                      <Input
                        type="url"
                        name="firmWebUrl"
                        value={formData.firmWebUrl}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        style={{ paddingLeft: "2.75rem" }}
                      />
                    </InputWithIcon>
                  </InputGroup>
                  <InputGroup>
                    <Label>회사 이메일</Label>
                    <InputWithIcon>
                      <Mail className="icon" />
                      <Input
                        type="email"
                        name="firmEmail"
                        value={formData.firmEmail}
                        onChange={handleChange}
                        placeholder="contact@company.com"
                        style={{ paddingLeft: "2.75rem" }}
                      />
                    </InputWithIcon>
                  </InputGroup>
                  <InputGroup>
                    <Label>회사 전화번호</Label>
                    <InputWithIcon>
                      <Phone className="icon" />
                      <Input
                        type="tel"
                        name="firmPhone"
                        value={formData.firmPhone}
                        onChange={handleChange}
                        placeholder="02-0000-0000"
                        style={{ paddingLeft: "2.75rem" }}
                      />
                    </InputWithIcon>
                  </InputGroup>
                </InputGrid>
              </FormSection>
              <SubmitButton onClick={handleSubmit}>
                브랜드 등록하기
              </SubmitButton>
            </ContentWrapper>
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
  padding: 2rem;
  width: 100%;
  max-width: 900px;
  overflow: hidden;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 1.5rem;
  }
`;

const TitleText = styled.h2`
  font-size: 3rem;
  padding: 2rem;
  font-weight: 700;
  background-image: linear-gradient(to right, #e9faff, #b8d2ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 2rem;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 2rem;
    padding: 1rem;
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
    padding: 2rem 1rem;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const FormSection = styled.div`
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
`;

const Dot = styled.div<{ color: string }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin-right: 0.75rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: ${BREAKPOINTS.md}px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #bfdbfe;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: transparent;
    backdrop-filter: blur(4px);
  }
`;

const InputWithIcon = styled.div`
  position: relative;

  .icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    color: #9ca3af;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  background: linear-gradient(to right, #292e49, #bbd2c5);
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    transform: scale(1.02);
  }

  &:focus {
    outline: none;
  }
`;

const ButtonText = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: black;
  display: flex;
  align-items: center;
`;

export { BrandSignUpPage };
