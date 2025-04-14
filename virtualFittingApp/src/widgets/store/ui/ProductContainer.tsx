import {  ProductSmallCard,} from "@/shared";
import { IMG_TEST_CLOTHES, ICON_LIKE, ICON_SHARE } from "@/shared/constants";
import styled from "styled-components";
import { useState } from "react";

function ProductContainer({ product }: { product: any }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  return (
    <ProductBox>
      <ProductImageBox>
      <ProductSmallImagesContainer>
          <ProductSmallCard src={IMG_TEST_CLOTHES} />
          <ProductSmallCard src={IMG_TEST_CLOTHES} />
          <ProductSmallCard src={IMG_TEST_CLOTHES} />
        </ProductSmallImagesContainer>
      <ProductImage src={product.image} alt={product.name} />

      </ProductImageBox>
      <ProductInfoBox>
        <TopRow>
          <Brand>BASILIUM</Brand>
        </TopRow>
        <TopRow>
          <ProductName>클래식 루즈핏 티셔츠</ProductName>
          <IconImage src={ICON_LIKE} alt="like icon" />
        </TopRow>
        <TopRow>
          <Price>￦50,000</Price>
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
        <SelectedColorText>{selectedColor} | 폴리에스터</SelectedColorText>
      </ProductInfoBox>
    </ProductBox>
  );
}

const ProductBox = styled.section`
  display: flex;
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  padding: 64px 64px;
`;

const ProductImageBox = styled.div`
  width: 50%;
  display: flex;
  margin-left: 128px;
`;

const ProductImage = styled.img`
  flex: 1;
  aspect-ratio: 4 / 5;
  padding: 0 24px;
  object-fit: cover;
`;

const ProductSmallImagesContainer = styled.div`
  width: 100px;
  display: flex;
  gap: 8px;
  flex-flow: column nowrap;
`;

const ProductInfoBox = styled.div`
  width: 50%;
  display: flex;
  margin-right: 128px;
  flex-direction: column;
  gap: 8px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // border: 1px solid black;
`;

const Brand = styled.div`
  font-family: 'HelveticaNeueLight', sans-serif;
  font-size: 1rem;
  color: black;
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const DescriptionBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const ProductName = styled.div`
  font-family: 'HelveticaNeueLight', sans-serif;
  font-size: 2vw;
  font-weight: 300;
  color: black;
`;

const Price = styled.div`
  font-family: 'HelveticaNeueLight', sans-serif;
  font-size: 2vw;
  font-weight: 300;
  color: black;
`;

const ColorSwatches = styled.div`
  display: flex;
  gap: 4px;
`;

const ColorCircle = styled.div<{ $color: string; $selected?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: ${(props) => (props.$selected ? "2px" : "1px")} solid black;
  cursor: pointer;
`;

const Description = styled.p`
  font-family: "Prata-Regular";
  font-size: 1vw;
  font-weight: 500;
  color: black;
  border: 1px solid black;
`;

const SelectedColorText = styled.div`
  display: flex;
  font-size: 0.75vw;
  font-family: 'HelveticaNeueLight', sans-serif;
  color: black;
`;

export { ProductContainer };
