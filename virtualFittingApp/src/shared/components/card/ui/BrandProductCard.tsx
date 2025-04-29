import * as S from "@/shared/components/card/ui/css/ProductCard.css";
import { type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

type ProductCardType = {
  productId: number;
  productName: string;
  productPrice: number;
  productPhotoUrl: string;
  productPhotoColorOptions: string[];
  className?: string;
};

function BrandProductCard({
  productId,
  productName,
  productPrice,
  productPhotoUrl,
  productPhotoColorOptions,
  className,
}: ProductCardType) {
  const router = useNavigate();

  const onClickCard = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    router(`/brand/product/${productId}`);
  };

  const showPrice = (input: number) => {
    const inputStr = input.toString();
    return inputStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <S.Wrapper onClick={onClickCard} className={`${className}`}>
      <S.ProductImg
        src={productPhotoUrl ?? ""}
        alt={`productPhotoUrl-${productId}`}
      />
      <S.ProductInfoContainer>
        <S.ProductTitle>{productName}</S.ProductTitle>
        <S.ProductSubOption>
          <S.ProductColorPalleteBox>
            {productPhotoColorOptions.map((item: string, key: number) => {
              return <S.ProductColorPallete pallete={item} key={key} />;
            })}
          </S.ProductColorPalleteBox>
          <S.ProductPrice>{`₩${showPrice(productPrice)}`}</S.ProductPrice>
        </S.ProductSubOption>
      </S.ProductInfoContainer>
    </S.Wrapper>
  );
}

export { BrandProductCard };
