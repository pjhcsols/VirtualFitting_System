import * as S from "@/widgets/brand/ui/css/BrandProductPreview.css";

type BrandProductPreview = {};

function BrandProductPreview() {
  return (
    <S.Wrapper>
      <S.ProductInfoContainer>
        <S.ProductPhotoContainer>
          <S.ProductPhotoBox></S.ProductPhotoBox>
          <S.ProductPhoto />
        </S.ProductPhotoContainer>
        <S.ProductInfoBox>
          <S.ProductTitleBox>
            <span className="desc-text"></span>
          </S.ProductTitleBox>
          <S.ProductPriceBox>
            <span className="desc-text"></span>
          </S.ProductPriceBox>
          <S.ProductColorBox></S.ProductColorBox>
          <S.ProductSizeContainer>
            <S.ProductSize></S.ProductSize>
          </S.ProductSizeContainer>
        </S.ProductInfoBox>
      </S.ProductInfoContainer>
    </S.Wrapper>
  );
}

export { BrandProductPreview };
