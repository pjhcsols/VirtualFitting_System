import * as S from "@/pages/admin/ui/css/AdminTotalProduct.css";
import { AdminProductSearch, AdminSliderEditor } from "@/widgets";

function AdminTotalProduct() {
  return (
    <S.Wrapper>
      <S.TitleContainer>
        <span>전체 품목 관리</span>
      </S.TitleContainer>
      <S.SliderContainer>
        <AdminSliderEditor />
      </S.SliderContainer>
      <S.ProductContainer>
        <AdminProductSearch />
      </S.ProductContainer>
    </S.Wrapper>
  );
}

export { AdminTotalProduct };
