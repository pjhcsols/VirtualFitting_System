import * as S from "@/pages/admin/ui/css/AdminCreateProductPage.css";
import { ProductEditor } from "@/widgets";

function AdminCreateProductPage() {
  return (
    <S.Wrapper>
      <div className="title-box">
        <span className="title">제품 생성</span>
      </div>
      <S.ContentContainer>
        <ProductEditor />
      </S.ContentContainer>
    </S.Wrapper>
  );
}

export { AdminCreateProductPage };
