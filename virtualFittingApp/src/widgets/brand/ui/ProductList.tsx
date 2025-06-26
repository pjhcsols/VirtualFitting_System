import * as S from "@/widgets/brand/ui/css/ProductList.css";

import { ProductAddButton, Title } from "@/shared";
import { Suspense } from "react";

type ProductListType = {
  products: any[];
};

function ProductList({ products }: ProductListType) {
  return (
    <Suspense>
      <S.Wrapper>
        <S.TitleContainer>
          <Title isDark={true}>내 상품</Title>
          <ProductAddButton />
        </S.TitleContainer>
        <S.ProductContainer></S.ProductContainer>
      </S.Wrapper>
    </Suspense>
  );
}

export { ProductList };
