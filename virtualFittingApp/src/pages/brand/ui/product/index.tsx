import { useProduct } from "@/pages/brand/hooks/useProduct";
import * as S from "./style";
import { ProductColumnn } from "@/pages/brand/components/column";
import { getQueryParameter, type ServerProductDto } from "@/shared";
import { useLocation } from "react-router-dom";

function BrandProduct() {
  const location = useLocation();
  const { page, size } = getQueryParameter(location.pathname);
  const { products } = useProduct({ page, size });

  return (
    <S.Wrapper>
      <S.OptionContainer>
        <S.OptionBox>
          <span className="blue-text">총</span>
          <span className="text">40건</span>
        </S.OptionBox>
        <S.ProductCreateButton to={"/products/create"}>
          <span>상품 추가</span>
        </S.ProductCreateButton>
      </S.OptionContainer>
      <S.ProductContainer>
        {products.map((item: ServerProductDto, key: number) => {
          return <ProductColumnn product={item} key={key} />;
        })}
      </S.ProductContainer>
    </S.Wrapper>
  );
}

export { BrandProduct };
