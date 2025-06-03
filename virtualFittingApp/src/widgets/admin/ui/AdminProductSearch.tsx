import { BrandSearch } from "@/shared";
import * as S from "@/widgets/admin/ui/css/AdminProductSearch.css";

function AdminProductSearch() {
  return (
    <S.Wrapper>
      <S.SearchContainer>
        <BrandSearch placeholder="Ex) productId... 1, 2, 3" />
      </S.SearchContainer>
      <S.ProductContainer></S.ProductContainer>
    </S.Wrapper>
  );
}

export { AdminProductSearch };
