import { BasiliumLogo, PrataText } from "@/shared";
import * as S from "./style";

function Header() {
  return (
    <S.Wrapper>
      <S.LogoContainer>
        <BasiliumLogo />
        <PrataText>BASILIUM</PrataText>
      </S.LogoContainer>
      <S.ContentContainer>
        <S.ContentBox>
          <span>PRODUCT</span>
        </S.ContentBox>
        <S.ContentBox>
          <span>PAYMENT</span>
        </S.ContentBox>
      </S.ContentContainer>
    </S.Wrapper>
  );
}

export { Header };
