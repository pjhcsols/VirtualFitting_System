import { useState, useRef } from "react";
import styled from "styled-components";
import { MYUSER_ICON, CAMERA_ICON, MALE_ICON, FEMALE_ICON} from "@/pages/my/constants";  
import { MyHeader } from "@/shared/components/header";
import penIcon from "./pen.png";
import { UserFormData } from "../types/user";
import { submitUserInfo } from "../api/submit.action";
import { handleImageFileChange } from "@/pages/my";

function MypageDetail() {
    const profileInputRef = useRef<HTMLInputElement | null>(null);
    const photoInputRef = useRef<HTMLInputElement | null>(null);  
    const [formData, setFormData] = useState<UserFormData>({
          id: "",
          name: "",
          email: "",
          phoneNumber: "",
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

    const [profilePreviewImage, setProfilePreviewImage] = useState<string | null>(null);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [photoPreviewImage, setPhotoPreviewImage] = useState<string | null>(null);
    const [photoImageFile, setPhotoImageFile] = useState<File | null>(null);

    const handleSubmit = async () => {
      try {
        await submitUserInfo(formData, profileImageFile ?? undefined, photoImageFile ?? undefined);
        alert("회원정보 저장 완료!");
      } catch {
        alert("저장 실패");
      }
    };

    const handleUpProfileButton = () => {
      profileInputRef.current?.click();
    };  

    const handleUpPhotoButton = () => {
      photoInputRef.current?.click();
    }; 
       
    return (
        <PageWrapper>
        <HeaderWrapper>
            <MyHeader title="회원정보 수정" />
        </HeaderWrapper>

        <ContentWrapper>
            <AvatarContainer>
              <AvatarIcon src={profilePreviewImage ?? MYUSER_ICON} alt="사용자 이미지" />
              <PenIcon src={penIcon} alt="수정 아이콘" onClick={handleUpProfileButton} />
              <HiddenInput
                type="file"
                accept="image/*"
                ref={profileInputRef}
                onChange={(e) => handleImageFileChange(e, setProfilePreviewImage, setProfileImageFile)}
              />
            </AvatarContainer>
            <Divider />
            <Form>
            <FormField> 
                <Label>아이디</Label>
                <Input 
                    placeholder="아이디를 입력해주세요." 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </FormField>
            <FormField>
                <Label>이메일</Label>
                <Input 
                    placeholder="이메일을 입력해주세요." 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value})}
                />
            </FormField>
            <FormField>
                <Label>이름</Label>
                <Input 
                    placeholder="이름을 입력해주세요." 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value})}
                />
            </FormField>
            <FormField>
                <Label>휴대폰 번호</Label>
                <TelForm>
                <PhoneInput 
                    placeholder="- 없이 입력" 
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value})}
                />
                <AuthButton>인증</AuthButton>
                </TelForm>
            </FormField>
            <FormField>
                <Label>생년월일</Label>
                <Input 
                    placeholder="YYYY-MM-DD" 
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value})}
                />
            </FormField>
            <FormField>
                <Label>성별</Label>
                <GenderGroup>
                    <GenderButton
                        type="button"
                        selected={formData.gender === "남자"}
                        onClick={() => setFormData({ ...formData, gender: "남자" })}
                    >
                        <GenderImg 
                            src={MALE_ICON} 
                            alt="남자"
                            selected={formData.gender === "남자"}
                        /> 
                        남자
                        </GenderButton>
                    <GenderButton
                        type="button"
                        selected={formData.gender === "여자"}
                        onClick={() => setFormData({ ...formData, gender: "여자"})}
                        >
                            <GenderImg 
                                src={FEMALE_ICON} 
                                alt="여자"
                                selected={formData.gender === "여자"}
                            />
                            여자
                        </GenderButton>
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
                <Label1>사진</Label1>
                <div>
                <PictureBox htmlFor="imageUpload">
                    {photoPreviewImage ? (
                        <PreviewImg src={photoPreviewImage} alt="미리보기" />
                ) : (
                        <CameraImg src={CAMERA_ICON} alt="카메라 아이콘" />
                )}
                </PictureBox>
                <HiddenInput 
                  type="file" 
                  id="photoUpload" 
                  accept="image/*" 
                  onChange={(e) => handleImageFileChange(e, setPhotoPreviewImage, setPhotoImageFile)}
                  ref={photoInputRef} />
                <RegisterButton type="button" onClick={handleUpPhotoButton}>변경 / 등록</RegisterButton>
                </div>
            </FormField>
            </Form>
        </ContentWrapper>

        <FooterWrapper>
            <StoreButton onClick={handleSubmit}>저장하기</StoreButton>
        </FooterWrapper>
        </PageWrapper>
    );
}

export { MypageDetail };



const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  min-height: 100vh;
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
  margin-left: 30px;
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

    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    
`;

const AvatarIcon = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const PenIcon = styled.img`
  position: absolute;
  right: 5px;
  bottom: 14px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Divider = styled.div`
  width: 590px;
  height: 1px;
  background: #F2F3F5;
  margin: 20px 0;
  margin-right: 4px;
`;

const Form = styled.div`
  width: 500px;
  margin-left: 15px;
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

const Label1 = styled.label`
  flex: 0 0 120px;
  font-size: 14px;
  color: #202429;
  margin-bottom: 35px;
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

const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-top: 15px;
  margin-right: 20px;
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

const GenderButton = styled.button<{ selected: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 156px;
  height: 40px;
  border: 1px solid #e4e6e9;
  border-radius: 6px;
  border: 2px solid ${(props) => (props.selected ? "#000" : "#e4e6e9")};
  color: ${(props) => (props.selected ? "#000" : "#999")};
  background: #fff;
  font-size: 14px;
  cursor: pointer;
`;

const GenderImg = styled.img<{ selected: boolean}>`
  width: 16px;
  height: 16px;
  filter: ${(props) =>
    props.selected ? "#e4e6e9" : "#000"};
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

const RegisterButton = styled.button`
  margin-top: 10px;
  font-size: 12px;
  border: 1px solid #e4e6e9;
  border-radius: 6px;
  background: #fff;
  padding: 5px 10px;
`;

const StoreButton = styled.button`
  width: 100%;
  max-width: 550px;
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
