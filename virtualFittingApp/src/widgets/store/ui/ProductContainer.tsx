import {  ProductSmallCard,} from "@/shared";
import { IMG_TEST_CLOTHES, ICON_LIKED, ICON_UNLIKED, ICON_SHARE } from "@/shared/constants";
import { LikeButton } from "@/shared";
import styled from "styled-components";
import { useState } from "react";
import { xlDouble, xl, lg, md, sm } from "@/shared";
import { AIButton } from "@/shared";

function ProductContainer({ product }: { product: any }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  return (
    <ProductBox>
        <ProductSmallImagesContainer>
            <ProductSmallCard />
            <ProductSmallCard />
            <ProductSmallCard />
            <ProductSmallCard />
            <ProductSmallCard />
            <ProductSmallCard />
            <ProductSmallCard />
          </ProductSmallImagesContainer>
        <ProductImage src={product.image} alt={product.name} />
      <ProductInfoBox>
        <TopRow>
          <Brand> {product.brand} </Brand>
        </TopRow>
        <TopRow>
          <ProductName> {product.name} </ProductName>
          <LikeButton />
        </TopRow>
        <TopRow>
          <Price>￦{product.price}</Price>
          <IconImage src={ICON_SHARE} alt="share icon" />
        </TopRow>
        <ColorSwatches>
          {product.colors.map((color: string, index: number) => (
            <ColorCircle
              key={index}
              $color={color}
              $selected={selectedColor === color}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </ColorSwatches>
        <SelectedColorText> {product.materials.join(", ")} | {selectedColor} </SelectedColorText>
        <Description>
          클래식한 오버핏 티셔츠{'\n'}
          한겨울에도 착용하기 좋습니다
        </Description>
        <SizeBoxMiddle>
          {product.availableSizes.map((size: string) => (
            <SizeItem key={size}>{size}</SizeItem>
          ))}
        </SizeBoxMiddle>
        <SizeBoxBottom>
          <AIButton></AIButton>
          <AddButton>ADD</AddButton>
        </SizeBoxBottom>
      </ProductInfoBox>
    </ProductBox>
  );
}

const ProductBox = styled.section`
  display: flex;
  gap: 4px;
  width: 100%;
  max-width: 1200px;
  flex-direction: row;
  // justify-content: space-between;
  align-items: flex-start;

  @media (max-width: ${md}px) {
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
`;

const ProductImage = styled.img`
  width: 510px;
  max-width: 510px;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  height: auto;
  order: 0;

  @media (max-width: ${md}px) {
    width: 100%;
    max-width: 510px;
  }
`;

const ProductSmallImagesContainer = styled.div`
  // width: 80px;
  display: flex;
  gap: 8px;
  height: 100%;
  object-fit: cover;
  flex-flow: column nowrap;
  margin: 0px 4px;

  @media (max-width: ${md}px) {
    flex-direction: row;
    justify-content: center;
    width: auto;
    order: 2;
  }
`;

const ProductInfoBox = styled.div`
  width: 500px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  order: 3;
  margin: 0px 32px;

  @media (max-width: ${lg}px) {
    margin: 0px 16px;
  }

  @media (max-width: ${md}px) {
    width: 100%;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.div`
  font-family: 'HelveticaNeueLight', sans-serif;
  font-size: 16px;
  color: black;
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const ProductName = styled.div`
  font-family: 'HelveticaNeueLight', sans-serif;
  font-size: 24px;
  font-weight: 300;
  color: black;
`;

const Price = styled.div`
  font-family: 'HelveticaNeueLight', sans-serif;
  font-weight: 300;
  color: black;
  font-size: 24px;
`;

const ColorSwatches = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const ColorCircle = styled.div<{ $color: string; $selected?: boolean }>`
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 1px solid gray;
  box-sizing: border-box;

  ${(props) =>
    props.$selected &&
    `
    &::after {
      content: "";
      align-items: center;
      position: absolute;
      top: -4px;
      left: -4px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid #ccc; 
      box-sizing: border-box;
    }
  `}
`;

const SelectedColorText = styled.div`
  display: flex;
  font-size: 14px;
  font-family: 'HelveticaNeueLight', sans-serif;
  color: black;
  padding: 4px 0px
`;

const Description = styled.p`
  white-space: pre-line;
  display: flex;
  font-family: 'HelveticaNeueLight', sans-serif;
  font-size: 14px;
  color: black;
  text-align: left;
  padding: 16px 0px;
`;

const SizeBoxMiddle = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 0px;
`; 

const SizeBoxBottom = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 0px;

  @media (max-width: ${md}px) {
    justify-content: center;
    align-items: center;
  }
`; 

const SizeItem = styled.div`
  width: 80px;
  height: 40px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'HelveticaNeueLight', sans-serif;
  font-size: 14px;
  cursor: pointer;
  color: black
`;

const AddButton = styled.div`
  width: 200px;
  height: 50px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'HelveticaNeueLight', sans-serif;
  font-size: 16px;
  cursor: pointer;
  background: black;
  
  @media (max-width: ${md}px) {
    width: 50%;
  }
`

export { ProductContainer };
