import {
  LikeButton,
  ProductSmallCard,
  ShareButton,
  ShoppingCartButton,
} from "@/shared";
import { ICON_REVIEW, IMG_TEST_CLOTHES } from "@/shared/constants";
import styled from "styled-components";

function ProductContainer() {
  return (
    <ProductBox>
      <ProductImageBox>
        <ProductImage src="" alt="product-image" />
        <ProductSmallImagesContainer>
          <ProductSmallCard src={IMG_TEST_CLOTHES} />
          <ProductSmallCard src={IMG_TEST_CLOTHES} />
          <ProductSmallCard src={IMG_TEST_CLOTHES} />
        </ProductSmallImagesContainer>
      </ProductImageBox>
      <ProductDescriptionBox>
        <BrandBox>
          <BrandTitle>BASILIUM</BrandTitle>
          <Description>10% OFF</Description>
        </BrandBox>
        <DescriptionBox>
          <ProductTitle>ONE-TUCK WIDE SWEAT PANTS [BLACK]</ProductTitle>
        </DescriptionBox>
        <DescriptionBox>
          <ReviewScoreText>4.8</ReviewScoreText>
          <ReviewIcon />
          <ProductReviewDescription>1000 REVIEWS</ProductReviewDescription>
        </DescriptionBox>
        <DescriptionBox>
          <PriceText>10,000원</PriceText>
        </DescriptionBox>
        <ColorContainer>
          <ColorText>Another Color</ColorText>
          <ColorBoxes>
            <ProductSmallCard src={IMG_TEST_CLOTHES} />
            <ProductSmallCard src={IMG_TEST_CLOTHES} />
          </ColorBoxes>
        </ColorContainer>
        <DescriptionBox>
          <ShoppingCartButton id={`1`} />
        </DescriptionBox>
        <ButtonContainer>
          <LikeButton />
          <ShareButton />
        </ButtonContainer>
      </ProductDescriptionBox>
    </ProductBox>
  );
}

const ProductBox = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
`;

const ProductImageBox = styled.div`
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 30vw;
  height: 45vw;
  border-radius: 24px;
  background: #7f7f7f 50%;
  box-shadow: 0px 20px 20px 0 rgb(0, 0, 0, 0.25);
`;

const ProductSmallImagesContainer = styled.div`
  box-sizing: border-box;
  padding: 30px 3.5vw;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const ProductDescriptionBox = styled.div`
  box-sizing: border-box;
  padding: 10px 32px;
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

const DescriptionBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const ColorContainer = styled(DescriptionBox)`
  flex-flow: column nowrap;
  align-items: flex-start;
`;

const ColorBoxes = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const BrandBox = styled(DescriptionBox)`
  justify-content: space-between;
`;

const BrandTitle = styled.h1`
  font-family: "Prata-Regular";
  font-size: 2vw;
  color: black;
`;

const ProductTitle = styled.p`
  font-family: "Prata-Regular";
  font-size: 1.5vw;
  color: black;
`;

const Description = styled.p`
  font-family: "Prata-Regular";
  font-size: 1vw;
  font-weight: 500;
  color: black;
`;

const ColorText = styled(Description)`
  font-family: "studio-sans";
  font-size: 1vw;
  text-transform: uppercase;
`;

const ProductReviewDescription = styled(Description)`
  font-family: "Pretendard";
  font-size: 0.8vw;
  color: gray;
`;

const ReviewScoreText = styled(ProductReviewDescription)`
  color: black;
`;

const ReviewIcon = styled.img.attrs({ src: ICON_REVIEW, alt: "review-icon" })`
  width: 1.75vw;
  height: 1.75vw;
  object-fit: contain;
`;

const PriceText = styled.span`
  font-family: "studio-sans";
  font-size: 1.2vw;
  font-weight: 500;
  color: black;
`;

const ButtonContainer = styled(DescriptionBox)`
  gap: 2vw;
`;

export { ProductContainer };
