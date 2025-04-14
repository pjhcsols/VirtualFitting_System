import * as S from "@/pages/brand/ui/css/BrandDashboard.css";
import { BrandSearch } from "@/shared";

function BrandDashboard() {
  return (
    <S.Wrapper>
      <S.SearchContainer>
        <BrandSearch />
      </S.SearchContainer>
      <S.ProductList></S.ProductList>
    </S.Wrapper>
  );
}

export { BrandDashboard };
