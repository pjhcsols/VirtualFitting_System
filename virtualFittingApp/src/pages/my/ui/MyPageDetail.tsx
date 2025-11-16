import { useState, useRef, useEffect} from "react";
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';
import { getAccessTokenStringFromCookie } from "@/entities/auth";
import styled from "styled-components"; 
import icon_user from "@/shared/assets/icons/icon-user.svg";
import icon_up from "@/shared/assets/icons/icon-up.svg";
import icon_down from "@/shared/assets/icons/icon-down.svg";
import icon_add from "@/shared/assets/icons/icon-add.svg";
import { UserFormData, Gender, FormGender } from "@/entities/user/model/types";
import { handleImageFileChange } from "@/shared/lib/image.util";
import { removeUndefined } from "@/shared/utils/object";

const mapGenderToFormGender = (gender: Gender | null | undefined): FormGender => {
  if (gender === "MALE") return "M";
  if (gender === "FEMALE") return "F";
  return "";
};
import { sendVerificationEmail } from "@/shared/utils/email/sendVerificationEmail";
import { verifyAuthCode } from "@/shared/utils/email/verifyAuthCode";
import { formatTime } from "@/shared/utils/time/time.util";
import { fetchUserInfo } from "@/shared/api/get.api";
import { splitAddressString } from "@/shared/utils/address";
import { EmailVerificationInput } from "@/features/user-profile/ui/email-verification-input";

import { 
  fetchMyProfileImageUrl, 
  uploadUserProfileImage,
  fetchMyRegisteredImageUrl,
  uploadUserImage,
  updateUserDetail,
  UpdateUserDetailRequest,
} from "@/entities/user";

import { BREAKPOINTS } from "@/shared";
import { formatDateAuto } from "@/shared/utils/date/dateAuto.util";
import { StyledGlassCard, ActiveDivider } from "@/entities/order";
import { ActionButton } from "@/features/review-actions/review-actions";

function MypageDetail() {
    const { userId } = useRecoilValue(authState);
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
                    gender: "",
                    size: {            height: 0,
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
            thighWidth: 0,
        },
        userProfileImageUrl: "",
        userImageUrl: "",
    }); 

      const [profilePreviewImage, setProfilePreviewImage] = useState<string | null>(null);
      const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
      const [photoPreviewImage, setPhotoPreviewImage] = useState<string | null>(null);
      const [photoImageFile, setPhotoImageFile] = useState<File | null>(null);
      const [saving, setSaving] = useState(false);

      useEffect(() => {
        const loadUserInfo = async () => {
          if (!userId) return;
          const res = await fetchUserInfo();
          const userInfo = res.data;
          const addressParts = splitAddressString(userInfo.address);
          setFormData({
            name: userInfo.name ?? "",
            password: userInfo.password ?? "",
            emailAddress: userInfo.emailAddress ?? "",
            phoneNumber: userInfo.phoneNumber ?? "",
            nickname: userInfo.nickname ?? "",
            birthDate: userInfo.birthDate?.split("T")[0] ?? "",
            address: {
              zonecode: addressParts.zonecode,
              address: addressParts.address,
              detailAddress: addressParts.detailAddress
            },
            gender: mapGenderToFormGender(userInfo.gender),
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
              thighWidth: userInfo.thighWidth ?? 0,
              rise: userInfo.rise ?? 0,
              hemWidth: userInfo.hemWidth ?? 0
            },
            userProfileImageUrl: userInfo.userProfileImageUrl ?? "",
            userImageUrl: userInfo.userImageUrl ?? "",
          });

          const profileUrl = await fetchMyProfileImageUrl(userId);
          const photoUrl = await fetchMyRegisteredImageUrl(userId);

          if (profileUrl) setProfilePreviewImage(profileUrl);
          if (photoUrl) setPhotoPreviewImage(photoUrl);
        };

        loadUserInfo();
      }, [userId]);
      
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
        if (saving) return;
        setSaving(true);
        
        const currentUserId = userId;
        const accessTokenString = getAccessTokenStringFromCookie();
        const getValidNumber = (val: number | null | undefined): number | undefined => {
          if (val === null || val === undefined || val === 0) {
              return undefined;
          }
          return Number(val); 
        };

        const getValidString = (val: string | undefined): string | undefined => {
          return (val === undefined || val === null || val === '') ? undefined : val;
        };

        try {
          if (!currentUserId || !accessTokenString) {
              throw new Error("인증 정보가 부족하여 저장할 수 없습니다.");
          }

          const updatePayload: Partial<UpdateUserDetailRequest> = {
            password: (formData.password && !formData.password.startsWith('{bcrypt}') && formData.password.length > 0)
                ? formData.password
                : undefined,
            emailAddress: getValidString(formData.emailAddress),
            phoneNumber: getValidString(formData.phoneNumber),
            name: getValidString(formData.name),
            nickname: getValidString(formData.nickname),

            address: formData.address.address 
                ? `${formData.address.zonecode} ${formData.address.address} ${formData.address.detailAddress}`.trim()
                : undefined,
                
            birthDate: formData.birthDate 
                ? new Date(formData.birthDate).toISOString() 
                : undefined,
            height: getValidNumber(formData.size.height),
            weight: getValidNumber(formData.size.weight),
            totalLength: getValidNumber(formData.size.totalLength),
            chest: getValidNumber(formData.size.chest),
            shoulder: getValidNumber(formData.size.shoulder),
            arm: getValidNumber(formData.size.arm),
            pantsTotalLength: getValidNumber(formData.size.pantsTotalLength),
            waistWidth: getValidNumber(formData.size.waistWidth),
            hipWidth: getValidNumber(formData.size.hipWidth),
            thighWidth: getValidNumber(formData.size.thighWidth),
            rise: getValidNumber(formData.size.rise),
            hemWidth: getValidNumber(formData.size.hemWidth),
          };

          const filteredPayload = removeUndefined(updatePayload);

          if (Object.keys(filteredPayload).length > 0) {
              await updateUserDetail(currentUserId, filteredPayload);
          }

          if (profileImageFile) {
            const uploadedProfileUrl = await uploadUserProfileImage(currentUserId, profileImageFile);
            if (!uploadedProfileUrl) throw new Error("프로필 이미지 업로드 실패");
          }

          if (photoImageFile) {
            const uploadedPhotoUrl = await uploadUserImage(currentUserId, photoImageFile);
            if (!uploadedPhotoUrl) throw new Error("전신 이미지 업로드 실패");
          }
          // alert("저장 완료");
        } catch (error) {
          // const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
          
          // alert(`저장 실패: ${errorMessage}`);
        } finally {
          setSaving(false);
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
            <StyledGlassCard style={{ maxWidth: 700, margin: "80px auto 48px",  }}>
                <ContentWrapper>
                  <AvatarContainer>
                    <AvatarIcon src={profilePreviewImage ?? icon_user} alt="사용자 이미지" onClick={handleUpProfileButton}/>
                    <HiddenInput
                      type="file"
                      accept="image/*"
                      ref={profileInputRef}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageFileChange(e, setProfilePreviewImage, setProfileImageFile)}
                    />
                  </AvatarContainer>
                  
                  <ActiveDivider />

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
                        src={showSizeForm ? icon_down : icon_up}
                        alt="토글 아이콘"
                      />
                    </LabelWithIcon>
                    {showSizeForm && (
                      <TelForm style={{ flexWrap: 'wrap', gap: '8px' }}>
                        <SizeInput 
                          placeholder="키   cm"
                          value={formData.size.height || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, height: Number(e.target.value) } })
                          }
                        />
                        <SizeInput 
                          placeholder="몸무게  kg"
                          value={formData.size.weight || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, weight: Number(e.target.value) } })
                          }
                        />
                        <SizeInput
                          placeholder="총장  cm" 
                          value={formData.size.totalLength || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, totalLength: Number(e.target.value) } })
                          }
                        />
                        <SizeInput 
                          placeholder="어깨  cm"
                          value={formData.size.shoulder || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, shoulder: Number(e.target.value) } })
                          } 
                        />
                        <SizeInput 
                          placeholder="가슴둘레 cm"
                          value={formData.size.chest || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, chest: Number(e.target.value) } })
                          } 
                        />
                        <SizeInput 
                          placeholder="팔길이  cm"
                          value={formData.size.arm || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, arm: Number(e.target.value) } })
                          } 
                        />  
                        <SizeInput 
                          placeholder="바지총장  cm"
                          value={formData.size.pantsTotalLength || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, pantsTotalLength: Number(e.target.value) } })
                          } 
                        /> 
                        <SizeInput 
                          placeholder="허리둘레  cm"
                          value={formData.size.waistWidth || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, waistWidth: Number(e.target.value) } })
                          } 
                        />
                        <SizeInput 
                          placeholder="엉덩이둘레  cm"
                          value={formData.size.hipWidth || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, hipWidth: Number(e.target.value) } })
                          } 
                        />
                        <SizeInput 
                          placeholder="밑위길이  cm"
                          value={formData.size.rise || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, size: { ...formData.size, rise: Number(e.target.value) } })
                          } 
                        />
                        <SizeInput 
                          placeholder="밑단너비  cm"
                          value={formData.size.hemWidth || ""}
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
                  <ActionButton size="medium" onClick={handleSubmit} disabled={saving}>
                    {saving ? "저장 중..." : "저장하기"}
                  </ActionButton>
              </FooterWrapper> 
            </StyledGlassCard>
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

  const HiddenInput = styled.input`
    display: none;
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
  color: white;
  display: flex;
  align-items: center;
`;

const Label1 = styled.label`
  width: 120px;
  font-size: 14px;
  color: white;
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
  font-size: 13px;
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
  font-size: 12px;
`;

const PhoneInput = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  background: rgba(200, 200, 200, 0.15);
  border-radius: 6px;
  font-size: 13px;
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
  margin-top: 4px;
  margin-left: 4px;
  margin-bottom: 1px;
`;

const TimerText = styled.p`
  color: #007bff;
  font-size: 12px;
  margin-right: 160px;
`;

const LabelWithIcon = styled.label`
  width: 120px;
  font-size: 14px;
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