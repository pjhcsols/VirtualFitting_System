import * as S from "@/pages/admin/ui/css/AdminTotalProduct.css";
import { AdminProductSearch } from "@/widgets";

function AdminTotalProduct() {
  return (
    <S.Wrapper>
      <S.TitleContainer>
        <S.Title>Product Management</S.Title>
      </S.TitleContainer>
      <S.ProductContainer>
        <AdminProductSearch />
      </S.ProductContainer>
    </S.Wrapper>
  );
}

export { AdminTotalProduct };
