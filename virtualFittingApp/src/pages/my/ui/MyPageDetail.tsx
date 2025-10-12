import { useState, useRef, useEffect} from "react";
import styled from "styled-components";
import { MYUSER_ICON, UP_ICON, DOWN_ICON} from "@/pages/my/constants"; 
import icon_add from "@/shared/assets/icons/icon-add.svg";
import { UserFormData } from "../types/user";
import { submitUserInfo } from "../api/submit.action";
import { handleImageFileChange } from "@/pages/my";
import { sendVerificationEmail } from "@/shared/utils/email/sendVerificationEmail";
import { verifyAuthCode } from "@/shared/utils/email/verifyAuthCode";
import { EmailVerificationInput } from "./EmailVerificationInput";
import { formatTime } from "@/shared/utils/time/time.util";
import { fetchUserInfo } from "../api/get.action";
import { fetchUserProfileImage, fetchUserImage} from "@/pages/my/api/image.action";
import { BREAKPOINTS } from "@/shared";
import { formatDateAuto } from "@/shared/utils/date/dateAuto.util";

function MypageDetail() {
    const profileInputRef = useRef<HTMLInputElement | null>(null);
    const photoInputRef = useRef<HTMLInputElement | null>(null);  
    const [loading, setLoading] = useState<boolean>(false);
    const [emailVerified, setEmailVerified] = useState<boolean>(false);
    const [authCode, setAuthCode] = useState<string>("");
    const [sentCode, setSentCode] = useState<string>("");
    const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(0); 
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false); 
    const [showSizeForm, setShowSizeForm] = useState<boolean>(false);
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        password: "",
        emailAddress: "",
        phoneNumber: "",
        nickname: "",
        birthDate: "",
        address: {address: "", zonecode: "", detailAddress: ""},
        size: {
            height: 0,
            weight: 0,
            totalLength: 0,
            chest: 0,
            shoulder: 0,
            arm: 0,
            pantsTotalLength: 0,
            waistWidth: 0,
            hipWidth: 0,
            rise: 0,
            hemWidth: 0,
        },
        userProfileImageUrl: "",
        userImageUrl: "",
    }); 

      const [profilePreviewImage, setProfilePreviewImage] = useState<string | null>(null);
      const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
      const [photoPreviewImage, setPhotoPreviewImage] = useState<string | null>(null);
      const [photoImageFile, setPhotoImageFile] = useState<File | null>(null);

      useEffect(() => {
        const loadUserInfo = async () => {
          const res = await fetchUserInfo();
          const userInfo = res.data;
          setFormData({
            name: userInfo.name ?? "",
            password: userInfo.password ?? "",
            emailAddress: userInfo.emailAddress ?? "",
            phoneNumber: userInfo.phoneNumber ?? "",
            nickname: userInfo.nickname ?? "",
            birthDate: userInfo.birthDate?.split("T")[0] ?? "",
            address: {
              address: userInfo.address ?? "",
              zonecode: "",
              detailAddress: ""
            },
            size: {
              height: userInfo.height ?? 0,
              weight: userInfo.weight ?? 0,
              totalLength: userInfo.totalLength ?? 0,
              chest: userInfo.chest ?? 0,
              shoulder: userInfo.shoulder ?? 0,
              arm: userInfo.arm ?? 0,
              pantsTotalLength: userInfo.pantsTotalLength ?? 0,
              waistWidth: userInfo.waistWidth ?? 0,
              hipWidth: userInfo.hipWidth ?? 0,
              rise: userInfo.rise ?? 0,
              hemWidth: userInfo.hemWidth ?? 0
            },
            userProfileImageUrl: userInfo.userProfileImageUrl ?? "",
            userImageUrl: userInfo.userImageUrl ?? "",
          });

          // const profileUrl = await fetchUserProfileImage();
          // const photoUrl = await fetchUserImage();

          // if (profileUrl) setProfilePreviewImage(profileUrl);
          // if (photoUrl) setPhotoPreviewImage(photoUrl);
        };

        loadUserInfo();
      }, []);
      
      useEffect(() => {
        if (!isTimerActive || timer <= 0) return;

        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsTimerActive(false);
              alert("인증 시간이 만료되었습니다.");
              setSentCode("");
              setAuthCode("");
              setShowCodeInput(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      }, [isTimerActive, timer]);

      const handleSubmit = async () => {
        try {
          await submitUserInfo(formData);
          alert("회원정보 저장 완료!");
        } catch {
          alert("저장 실패");
          console.log(formData);
        }
      };

      const handleUpProfileButton = () => {
        profileInputRef.current?.click();
      };  

      const handleUpPhotoButton = () => {
        photoInputRef.current?.click();
      }; 
      
      const handleSendVerification = async () => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setSentCode(code);
        setLoading(true);

        const success = await sendVerificationEmail(formData.emailAddress, code);
        if (success) {
          alert("이메일로 인증번호가 전송되었습니다.");
          setShowCodeInput(true);
          setIsTimerActive(true);
          setTimer(600);
        } else {
          alert("메일 전송 실패");
        }
        setLoading(false);
      };

      const handleVerifyCode = () => {
        const verified = verifyAuthCode(authCode, sentCode);
        if (verified) {
          alert("이메일 인증 성공!");
          setEmailVerified(true);
          setShowCodeInput(false);
          setIsTimerActive(false);
        } else {
          alert("인증번호가 일치하지 않습니다.");
        }
      };

      const openDaumPostcode = () => {
        new window.daum.Postcode({
          oncomplete: (data: any) => {
            setFormData((prev) => ({
              ...prev,
              address: {
                ...prev.address,
                address: data.roadAddress,
                zonecode: data.zonecode,
              },
            }));
          },
        }).open();
      };

      return (
          <PageWrapper>
            <GlassContainer>
                <ContentWrapper>
                  <AvatarContainer>
                    <AvatarIcon src={profilePreviewImage ?? MYUSER_ICON} alt="사용자 이미지" onClick={handleUpProfileButton}/>
                    {/* <PenIcon src={PEN_ICON} alt="수정 아이콘" onClick={handleUpProfileButton} /> */}
                    <HiddenInput
                      type="file"
                      accept="image/*"
                      ref={profileInputRef}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageFileChange(e, setProfilePreviewImage, setProfileImageFile)}
                    />
                  </AvatarContainer>
                  <Divider />
                  <Form>
                  <FormField> 
                      <Label>이름</Label>
                      <Input 
                          placeholder="이름을 입력해주세요." 
                          value={formData.name || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                      />
                  </FormField>
                  <FormField> 
                      <Label>비밀번호</Label>
                      <Input 
                          type="password"
                          placeholder="비밀번호를 입력해주세요." 
                          value={formData.password || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                      />
                  </FormField>
                  <FormField>
                      <Label>휴대폰 번호</Label>
                      <Input 
                          placeholder="- 없이 입력" 
                          value={formData.phoneNumber || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phoneNumber: e.target.value})}
                      />
                  </FormField>
                  <FormField>
                      <Label>닉네임</Label>
                      <Input 
                          placeholder="닉네임을 입력해주세요." 
                          value={formData.nickname || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, nickname: e.target.value})}
                      />
                  </FormField>
                  <FormField> 
                      <Label>이메일</Label>
                      <FieldWrapper>
                        <TelForm>
                          <PhoneInput 
                            placeholder="이메일을 입력해주세요." 
                            value={formData.emailAddress || ""}
                            disabled={emailVerified}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, emailAddress: e.target.value })}
                          />
                          <AuthButton type="button" onClick={handleSendVerification} disabled={loading || emailVerified}>
                            인증
                          </AuthButton>
                        </TelForm>
                        {emailVerified && <VerifiedMessage>인증되었습니다.</VerifiedMessage>}
                      </FieldWrapper>
                  </FormField>

                  {showCodeInput && (
                    <>
                      <EmailVerificationInput
                        authCode={authCode}
                        onChange={setAuthCode}
                        onVerify={handleVerifyCode}
                      />
                      {isTimerActive && (
                        <TimerText>남은 시간: {formatTime(timer)}</TimerText>
                      )}
                    </>
                  )}

                  <FormField>
                    <Label>생년월일</Label>
                    <Input
                        placeholder="YYYY-MM-DD"
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.birthDate}
                        onChange={(e) => {
                            const date = formatDateAuto(e.target.value);
                            setFormData(prev => ({ ...prev, birthDate: date }));
                        }}
                    />
                  </FormField>
                  <FormField>
                      <Label>주소</Label>
                      <FieldWrapper>
                        <TelForm>
                          <PhoneInput 
                            placeholder="우편번호" 
                            value={formData.address.zonecode || ""}
                            readOnly
                          />
                          <AuthButton type="button" onClick={openDaumPostcode}>
                            검색
                          </AuthButton>
                        </TelForm>
                        <Input
                          placeholder="주소"
                          value={formData.address.address || ""}
                          readOnly
                          style={{ marginTop: "8px" }}
                        />
                        <Input
                          placeholder="상세주소를 입력하세요"
                          value={formData.address.detailAddress || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setFormData((prev) => ({
                              ...prev,
                              address: { ...prev.address, detailAddress: e.target.value },
                            }));
                          }}
                          style={{ marginTop: "8px" }}
                        />
                      </FieldWrapper>
                  </FormField>
                  <FormField>
                    <Label1>사진</Label1>
                    <ImageBoxWrapper>
                      <PictureBox htmlFor="imageUpload">
                        {photoPreviewImage ? (
                          <PreviewImg src={photoPreviewImage} alt="미리보기" />
                        ) : (
                          <AddImg src={icon_add} alt="카메라 아이콘" />
                        )}
                      </PictureBox>
                      <HiddenInput 
                        type="file" 
                        id="photoUpload" 
                        accept="image/*" 
                        onChange={(e) => handleImageFileChange(e, setPhotoPreviewImage, setPhotoImageFile)}
                        ref={photoInputRef}
                      />
                      <RegisterButton type="button" onClick={handleUpPhotoButton}>
                        변경 / 등록
                      </RegisterButton>
                    </ImageBoxWrapper>
                  </FormField>
                  <FormField style={{ alignItems: 'flex-start' }}>
                    <LabelWithIcon onClick={() => setShowSizeForm(prev => !prev)}>
                      신체사이즈
                      <ToggleIcon
                        src={showSizeForm ? DOWN_ICON : UP_ICON}
                        alt="토글 아이콘"
                      />
                    </LabelWithIcon>
                    {showSizeForm && (
                      <TelForm style={{ flexWrap: 'wrap', gap: '8px' }}>
                        <SizeInput 
                          placeholder="키   cm"
                          value={formData.size.height === 0 ? "" : formData.size.height}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, height: Number(e.target.value) } })
                          }
                        />
                        <SizeInput 
                          placeholder="몸무게  kg"
                          value={formData.size.weight === 0 ? "" : formData.size.weight}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, weight: Number(e.target.value) } })
                          }
                        />
                        <SizeInput
                          placeholder="총장  cm" 
                          value={formData.size.totalLength === 0 ? "" : formData.size.totalLength}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, totalLength: Number(e.target.value) } })
                          }
                        />
                        <SizeInput 
                          placeholder="어깨  cm"
                          value={formData.size.shoulder === 0 ? "" : formData.size.shoulder}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, shoulder: Number(e.target.value) } })
                          } 
                        />
                        <SizeInput 
                          placeholder="가슴둘레 cm"
                          value={formData.size.chest === 0 ? "" : formData.size.chest}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, chest: Number(e.target.value) } })
                          } 
                        />
                        <SizeInput 
                          placeholder="팔길이  cm"
                          value={formData.size.arm === 0 ? "" : formData.size.arm}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, arm: Number(e.target.value) } })
                          } 
                        />  
                        <SizeInput 
                          placeholder="바지총장  cm"
                          value={formData.size.pantsTotalLength === 0 ? "" : formData.size.pantsTotalLength}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, pantsTotalLength: Number(e.target.value) } })
                          } 
                        /> 
                        <SizeInput 
                          placeholder="허리둘레  cm"
                          value={formData.size.waistWidth === 0 ? "" : formData.size.waistWidth}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, waistWidth: Number(e.target.value) } })
                          } 
                        />
                        <SizeInput 
                          placeholder="엉덩이둘레  cm"
                          value={formData.size.hipWidth === 0 ? "" : formData.size.hipWidth}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, hipWidth: Number(e.target.value) } })
                          } 
                        />
                        <SizeInput 
                          placeholder="밑위길이  cm"
                          value={formData.size.rise === 0 ? "" : formData.size.rise}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, rise: Number(e.target.value) } })
                          } 
                        />
                        <SizeInput 
                          placeholder="밑단너비  cm"
                          value={formData.size.hemWidth === 0 ? "" : formData.size.hemWidth}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, hemWidth: Number(e.target.value) } })
                          } 
                        />
                      </TelForm>
                    )}
                  </FormField>
                </Form>
              </ContentWrapper>

              <FooterWrapper>
                  <StoreButton onClick={handleSubmit}>저장하기</StoreButton>
              </FooterWrapper> 
            </GlassContainer>
          </PageWrapper>
      );
  }

  export { MypageDetail };


  const PageWrapper = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  `;

  const ContentWrapper = styled.div`
    padding: 10px 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    width: 100%;
    max-width: 800px;
    box-sizing: border-box;

    @media (max-width: ${BREAKPOINTS.md}px) {
      max-width: 100%;
    }
`;

const GlassContainer = styled.div`
  width: 100%;
  max-width: 700px;         
  margin: 32px auto 48px;
  margin-top: 50px;
  border-radius: 20px;
  overflow: hidden;

  background: rgba(200, 200, 200, 0.15);  
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);

  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.3),
    0 10px 30px rgba(0,0,0,0.15);


  padding: 24px 20px 16px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    margin: 20px auto 28px;   
    padding: 20px 14px 12px;
  }
`;

const FooterWrapper = styled.div`
  flex-shrink: 0;
  position: static;
  bottom: 0;
  margin-top: 20px;
  padding: 10px 0 10px;
  border-top: 1px solid rgba(255,255,255,0.5);
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 700px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
  }
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
    width: 100%;
    max-width: 700px;
    height: 1px;
    background: rgba(255,255,255,0.5);
    margin: 20px 0;
`;

  const Form = styled.div`
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const FormField = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  width: 100%;
  padding: 5px 20px;
  box-sizing: border-box;
  gap: 10px;
`;

const Label = styled.label`
  width: 120px;
  font-size: 14px;
  font-family: "Prata-Regular";
  color: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
`;

const Label1 = styled.label`
  width: 120px;
  font-size: 14px;
  font-family: "Prata-Regular";
  color: rgba(255,255,255,0.9);
  display: flex;
  align-items: flex-start;  
  justify-content: flex-start;
  align-self: start;
`;

  const Input = styled.input`
    flex: 1;
    min-width: 100px;
    padding: 10px;
    border: none;
    background: rgba(200, 200, 200, 0.15);
    border-radius: 6px;
    font-size: 14px;
    font-family: "Prata-Regular";
    color: #fff;
    outline: none;

    &::placeholder {
        color: rgba(255,255,255,0.5);
    }
  `;

  const TelForm = styled.div`
    display: flex;
    gap: 10px;
    flex: 1;
    justify-content: space-between;
    flex-wrap: wrap;
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
    background-color: #292E49;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-family: "Prata-Regular";
    cursor: pointer;

    &:hover {
      background-color: #000; 
    }
  `;

 const SizeInput = styled(Input)`
    flex: 1;
    min-width: 50px;
    max-width: 120px;
    text-align: center;
    font-family: "Prata-Regular";
    font-size: 12px;
`;

 const PhoneInput = styled.input`
    flex: 1;
    padding: 10px;
    border: none;
    background: rgba(200, 200, 200, 0.15);
    border-radius: 6px;
    font-size: 14px;
    font-family: "Prata-Regular";
    min-width: 100px;
    color: #fff;
    outline: none;

    &::placeholder {
        color: rgba(255,255,255,0.5);
    }
`;

const SharedBox = styled.div`
  width: 120px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 100%;
  }
`;

const PictureBox = styled(SharedBox).attrs({ as: 'label' })`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
`;

  const AddImg = styled.img`
    width: 40px;
    height: 40px;
  `;

const ImageBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  gap: 10px;
`;

const RegisterButton = styled(SharedBox).attrs({ as: 'button' })`
  margin-top: 10px;
  font-size: 12px;
  font-family: "Prata-Regular";
  border: none;
  border-radius: 6px;
  background-color: #292E49;
  padding: 5px 10px;
  color: #fff;
  cursor: pointer;

   &:hover {
      background-color: #000; 
    }

`;

  const StoreButton = styled.button`
    width: 100%;
    max-width: 550px;
    padding: 12px;
    background-color: #292E49;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-family: "Prata-Regular";

    &:hover {
      background-color: #000; 
    }
  `;

  const PreviewImg = styled.img`
      width: 100%;
      height: 100%;
      object-fit: cover;
  `;

  const FieldWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

  const VerifiedMessage = styled.p`
    color: #007bff;
    font-size: 12px;
    font-family: "Prata-Regular";
    margin-top: 4px;
    margin-left: 4px;
    margin-bottom: 1px;
  `;

  const TimerText = styled.p`
    color: #007bff;
    font-size: 12px;
    font-family: "Prata-Regular";
    margin-right: 160px;
`;

const LabelWithIcon = styled.label`
  width: 120px;
  font-size: 14px;
  font-family: "Prata-Regular";
  color: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 6px;
`;

const ToggleIcon = styled.img`
  width: 16px;
  height: 16px;
`;