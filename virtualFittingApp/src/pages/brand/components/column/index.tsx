import { useState } from "react";
import * as S from "./style";
import { type ServerProductDto } from "@/shared";

interface IProductColumn {
  product: ServerProductDto;
}

function ProductColumnn({ product }: IProductColumn) {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isDetail, setIsDetail] = useState<boolean>(false);

  return (
    <S.Wrapper
      clicked={isClicked}
      onClick={() => setIsClicked((prev) => !prev)}
    >
      <S.InfoWrapper>
        <S.Photo
          src={product.productPhotoUrls[0]}
          alt={`product-${product.productId}`}
        />
        <S.ProductTitle>{product.productName}</S.ProductTitle>
        <S.Arrow
          clicked={isDetail}
          onClick={() => setIsDetail((prev) => !prev)}
        />
      </S.InfoWrapper>
    </S.Wrapper>
  );
}

export { ProductColumnn };
