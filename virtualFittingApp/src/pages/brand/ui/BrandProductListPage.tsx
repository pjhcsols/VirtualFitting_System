import * as S from "@/pages/brand/ui/css/BrandProductListPage.css";
import { BrandProductCard, ProductCreateButton } from "@/shared";

function BrandProductListPage() {
  return (
    <S.Wrapper>
      <S.InfoContainer>
        <S.TextContainer>
          <S.BoldBlueText>총</S.BoldBlueText>
          <S.BoldText>10건</S.BoldText>
        </S.TextContainer>
        <S.ButtonContainer>
          <ProductCreateButton />
        </S.ButtonContainer>
      </S.InfoContainer>
      <S.CardContainer>
        <BrandProductCard />
      </S.CardContainer>
    </S.Wrapper>
  );
}

export { BrandProductListPage };
