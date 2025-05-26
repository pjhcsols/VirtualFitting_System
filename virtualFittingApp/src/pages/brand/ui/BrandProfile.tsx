import * as S from "@/pages/brand/ui/css/BrandProfile.css";
import { Profile } from "@/shared/components/input/ui/Profile";
import { MouseEvent, useState } from "react";
import type { BrandUserType } from "@/pages/brand/types/brandUser.d";
import { BrandInfoChanger } from "@/widgets";
import { BasiliumCard } from "@/shared";

function BrandProfile() {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  // if the mode is true, EDIT MODE
  // mode is false, VIEW MODE
  const [mode, setMode] = useState<boolean>(false);

  // 로고 이미지는 User 에 포함되어있음.
  const [profile, setProfile] = useState<File | null>(null);

  // 회사 정보 가져오는 Method
  const [brandInfo, setBrandInfo] = useState<BrandUserType>({
    firmName: "",
    firmAddress: "",
    businessRegistration: "",
    firmWebUrl: "",
  });

  const onClickModifyBtn = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMode((prev) => !prev);
    setIsClicked((prev) => !prev);
  };

  return (
    <S.Wrapper>
      <S.ProfileContainer>
        <Profile onChange={setProfile} />
      </S.ProfileContainer>
      <S.ProfileButtonContainer>
        <S.ProfileBtn isClicked={isClicked} onClick={onClickModifyBtn}>
          {mode ? "확인" : "수정"}
        </S.ProfileBtn>
      </S.ProfileButtonContainer>
      <S.ProfileContentContainer>
        <S.ProfilePreviewCardContainer>
          <BasiliumCard brandInfo={brandInfo} />
        </S.ProfilePreviewCardContainer>
        <S.ProfileInfoContainer>
          <BrandInfoChanger
            mode={mode}
            brandInfo={brandInfo}
            setBrandInfo={setBrandInfo}
          />
        </S.ProfileInfoContainer>
      </S.ProfileContentContainer>
    </S.Wrapper>
  );
}

export { BrandProfile };
