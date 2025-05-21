import {  ProductSmallCard,} from "@/shared";
import { IMG_TEST_CLOTHES, ICON_LIKED, ICON_UNLIKED, ICON_SHARE } from "@/shared/constants";
import { LikeButton } from "@/shared/components/button/ui/LikeButton";
import styled from "styled-components";
import { useState } from "react";

function ProductContainer({ product }: { product: any }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  return (
    <ProductBox>
      {/* <ProductImageGroup> */}
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
      {/* </ProductImageGroup> */}
      <ProductInfoBox>
        <TopRow>
          <Brand>BASILIUM</Brand>
        </TopRow>
        <TopRow>
          <ProductName>클래식 루즈핏 티셔츠</ProductName>
          <LikeButton />
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

const BREAKPOINT = {
  xlDouble: 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
};

const ProductBox = styled.section`
  display: flex;
  gap: 4px;
  width: 100%;
  max-width: 1400px;
  flex-direction: row;
  
  @media (max-width: ${BREAKPOINT.md}px) {
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
`;

// const ProductImageGroup = styled.div`
//   display: flex;
//   flex-direction: row;
//   gap: 16px;

//   @media (max-width: ${BREAKPOINT.md}px) {
//     flex-direction: column;
//     align-items: center;
//   }
// `;

const ProductImage = styled.img`
  width: 100%;
  max-width: 510px;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  height: auto;
  order: 0;

  @media (max-width: ${BREAKPOINT.lg}px) {
    max-width: 300px;
  }

  @media (max-width: ${BREAKPOINT.md}px) {
    width: 100%;
    max-width: 510px;
  }
`;


const ProductSmallImagesContainer = styled.div`
  width: 80px;
  display: flex;
  gap: 8px;
  flex-flow: column nowrap;

  @media (max-width: ${BREAKPOINT.md}px) {
    flex-direction: row;
    justify-content: center;
    width: auto;
    order: 2;
  }
`;

const ProductInfoBox = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  order: 3;
  margin: 0px 16px;

  // @media (max-width: ${BREAKPOINT.lg}px) {
  //   width: 300px;
  // }

  @media (max-width: ${BREAKPOINT.md}px) {
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
  font-size: 1rem;
  color: black;
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const ProductName = styled.div`
  font-family: 'HelveticaNeueLight', sans-serif;
  font-weight: 30;
  color: black;
  font-size: 1.5rem;
  @media (max-width: ${BREAKPOINT.md}px) {
    font-size: 1.25rem;
  }
`;

const Price = styled.div`
  font-family: 'HelveticaNeueLight', sans-serif;
  font-weight: 300;
  color: black;
  font-size: 1.5rem;
  @media (max-width: ${BREAKPOINT.md}px) {
    font-size: 1.25rem;
  }
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

const Description = styled.p`
  font-family: "Prata-Regular";
  font-size: 1vw;
  font-weight: 500;
  color: black;
  border: 1px solid black;
`;

const SelectedColorText = styled.div`
  display: flex;
  font-size: 12px;
  font-family: 'HelveticaNeueLight', sans-serif;
  color: black;
`;

export { ProductContainer };
