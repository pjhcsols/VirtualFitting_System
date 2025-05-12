import { BrandMyPageInputTitles } from "@/pages/brand/constants";
import type { BrandUserType } from "@/pages/brand/types/brandUser";
import * as S from "@/widgets/brand/ui/css/BrandInfoChanger.css";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

// 카드 클릭했을 때, 회사 website 로 넘어가도록 수정해놓기
// 프로필 동그라미를 지우고, 카드 뒷면을 설정 ( 명함 형태로 만들어도 나쁘지 않을듯)
type BrandInfoChangerType = {
  mode: boolean;
  brandInfo: BrandUserType;
  setBrandInfo: Dispatch<SetStateAction<BrandUserType>>;
};

function BrandInfoChanger({
  mode,
  brandInfo,
  setBrandInfo,
}: BrandInfoChangerType) {
  const onChangeBrandInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrandInfo({
      ...brandInfo,
      [name]: value,
    });
  };
  return (
    <S.Wrapper>
      {BrandMyPageInputTitles.map((item, key) => {
        return (
          <S.TitleInputContainer key={key}>
            <input
              type="text"
              id="input"
              name={item.name}
              value={brandInfo[item.name]}
              onChange={onChangeBrandInfo}
              disabled={!mode}
              required
            />
            {!brandInfo[item.name] && (
              <label htmlFor="input" className="label">
                {item.title}
              </label>
            )}
            <div className="underline" />
          </S.TitleInputContainer>
        );
      })}
    </S.Wrapper>
  );
}

export { BrandInfoChanger };
