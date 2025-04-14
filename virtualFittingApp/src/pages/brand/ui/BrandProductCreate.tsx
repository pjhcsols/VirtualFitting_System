import * as S from "@/pages/brand/ui/css/BrandProductCreate.css";
import { ProductEditor } from "@/widgets";

function BrandProductCreate() {
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

export { BrandProductCreate };
