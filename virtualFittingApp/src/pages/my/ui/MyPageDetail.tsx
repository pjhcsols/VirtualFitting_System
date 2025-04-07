import { useState } from "react";
import styled from "styled-components";
import userImg from "../../../shared/components/header/ui/UserImg.png";   
import { MyHeader } from "@/shared/components/header";
import femaleIcon from "./female.png";
import maleIcon from "./male.png";
import cameraIcon from "./camera.png";
import { UserFormData } from "../types/user";
import { submitUserInfo } from "../api/submit.action";
import { createPreviewImage } from "../utils/imagePreview";

function MypageDetail() {
    const [formData, setFormData] = useState<UserFormData>({
        id: "",
        name: "",
        email: "",
        phoneNumber: 0,
        birthdate: "",
        gender: "",
        size: {
          height: 0,
          weight: 0,
          length: 0,
          shoulder: 0,
        },
        photoUrl: "",
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const tempPreview = createPreviewImage(file);
          setPreviewImage(tempPreview);
          console.log(tempPreview);
        }
      };

    const handleSubmit = async () => {
        try {
          await submitUserInfo(formData);
          alert("회원정보 저장 완료!");
        } catch {
          alert("저장 실패");
        }
    };
       
    return (
        <PageWrapper>
        <HeaderWrapper>
            <MyHeader title="회원정보 수정" />
        </HeaderWrapper>

        <ContentWrapper>
            <AvatarBox>
            <AvatarIcon src={userImg} alt="사용자 이미지" />
            <H1>user1</H1>
            </AvatarBox>
            <Divider />
            <Form>
            <FormField>
                <Label>아이디</Label>
                <Input placeholder="아이디를 입력해주세요." />
            </FormField>
            <FormField>
                <Label>이메일</Label>
                <Input placeholder="이메일을 입력해주세요." />
            </FormField>
            <FormField>
                <Label>이름</Label>
                <Input placeholder="이름을 입력해주세요." />
            </FormField>
            <FormField>
                <Label>휴대폰 번호</Label>
                <TelForm>
                <PhoneInput placeholder="- 없이 입력" />
                <AuthButton>인증</AuthButton>
                </TelForm>
            </FormField>
            <FormField>
                <Label>생년월일</Label>
                <Input placeholder="YYYY-MM-DD" />
            </FormField>
            <FormField>
                <Label>성별</Label>
                <GenderGroup>
                    <GenderButton><GenderImg src={maleIcon} /> 남자</GenderButton>
                    <GenderButton><GenderImg src={femaleIcon} /> 여자</GenderButton>
                </GenderGroup>
            </FormField>
            <FormField>
                <Label>신체사이즈</Label>
                <TelForm>
                <SizeInput placeholder="키   cm" />
                <SizeInput placeholder="몸무게 kg" />
                <SizeInput placeholder="총장  cm" />
                <SizeInput placeholder="어깨  cm" />
                </TelForm>
            </FormField>
            <FormField>
                <Label>사진</Label>
                <div>
                <PictureBox htmlFor="imageUpload">
                    {previewImage ? (
                        <PreviewImg src={previewImage} alt="미리보기" />
                ) : (
                        <CameraImg src={cameraIcon} alt="카메라 아이콘" />
                )}
                </PictureBox>
                <HiddenInput type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} />
                <RegisterButton>변경 / 등록</RegisterButton>
                </div>
            </FormField>
            </Form>
        </ContentWrapper>

        <FooterWrapper>
            <StoreButton>저장하기</StoreButton>
        </FooterWrapper>
        </PageWrapper>
    );
}

export { MypageDetail };



const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100vh;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const ContentWrapper = styled.div`
  padding: 88px 88px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 25px;
`;

const FooterWrapper = styled.div`
    flex-shrink: 0;
    position: sticky;
    bottom: 0;
    background: #fff;
    padding: 10px 0;
    border-top: 1px solid #F2F3F5;
    display: flex;
    justify-content: center;
    width: 600px;
    margin-left: 120px;
`;

const AvatarBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarIcon = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const H1 = styled.p`
  margin-top: 10px;
  font-size: 16px;
`;

const Divider = styled.div`
  width: 590px;
  height: 1px;
  background: #F2F3F5;
  margin: 20px 0;
  margin-left: 15px;
`;

const Form = styled.div`
  width: 500px;
`;

const FormField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Label = styled.label`
  flex: 0 0 120px;
  font-size: 14px;
  color: #202429;
`;

const Input = styled.input`
    width: 300px;
    padding: 10px;
    border: 1px solid rgb(228, 230, 233);
    background: rgb(255, 255, 255);
    border-radius: 6px;
    font-size: 14px;

    &::placeholder {
        color: rgb(150, 150, 150);  /* placeholder 텍스트 색상 */
        font-weight: normal;
    }
`;

const TelForm = styled.div`
  display: flex;
  gap: 10px;
`;

const AuthButton = styled.button`
  width: 80px;
  height: 40px;
  background-color: #d9d9d9;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
`;

const GenderGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const GenderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 156px;
  border: 1px solid #e4e6e9;
  border-radius: 6px;
  background: #fff;
  font-size: 14px;
  color: rgb(150, 150, 150);
  cursor: pointer;
`;

const GenderImg = styled.img`
  width: 16px;
  height: 16px;
`;

const SizeInput = styled(Input)`
  flex: none;
  width: 50px;
  text-align: center;
  font-size: 12px;
`;

const PhoneInput = styled.input`
  width: 210px;
  padding: 10px;
  border: 1px solid #e4e6e9;
  border-radius: 6px;
  font-size: 14px;
`;

const PictureBox = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 180px;
  border: 1px solid #e4e6e9;
  cursor: pointer;
`;

const CameraImg = styled.img`
  width: 40px;
  height: 40px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const RegisterButton = styled.button`
  margin-top: 10px;
  font-size: 12px;
  border: 1px solid #e4e6e9;
  border-radius: 6px;
  background: #fff;
  padding: 5px 10px;
`;

const StoreButton = styled.button`
  width: 600px;
  padding: 12px;
  background-color: #d9d9d9;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
`;

const PreviewImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
