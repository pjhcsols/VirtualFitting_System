import { ProductContainer } from "@/widgets";
import * as S from "@/pages/admin/ui/css/AdminProductPage.css";

function AdminProductPage() {
  return (
    <S.Wrapper>
      <S.Title>출고 상품 상세보기</S.Title>
      <ProductContainer />
    </S.Wrapper>
  );
}

export { AdminProductPage };
