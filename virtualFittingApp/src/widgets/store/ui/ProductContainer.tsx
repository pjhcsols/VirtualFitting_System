import styled from "styled-components";
import { useState } from "react";

import {
  ProductSmallCard,
  LikeButton,
  AddButton,
  AIButton,
  PurchaseButton,
  QuantityBox,
  BREAKPOINTS,
  COLOR_MAP,
} from "@/shared";

import {
  IMG_TEST_CLOTHES,
  ICON_LIKED,
  ICON_UNLIKED,
  ICON_SHARE,
} from "@/shared";


function ProductContainer({ product }: { product: any }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0]);
  const [quantity, setQuantity] = useState(1);
  
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
          {product.discountedPrice ? (
            <PriceGroup>
              <DiscountPrice>{product.discountedPrice.toLocaleString()}원</DiscountPrice>
              <OriginalPriceBox>
                <OriginalPrice>{product.price.toLocaleString()}원</OriginalPrice>
                <DiscountRate>
                  {product.discountRate}%
                </DiscountRate>
              </OriginalPriceBox>
            </PriceGroup>
          ) : (
            <Price>￦{product.price.toLocaleString()}</Price>
          )}
          <IconImage src={ICON_SHARE} alt="share icon" />
        </TopRow>

        <Description>
          클래식한 오버핏 티셔츠{'\n'}
          한겨울에도 착용하기 좋습니다
        </Description>
        <ColorBoxContainer>
        {/* <MaterialsText> {product.materials.join(", ")} | {selectedColor} </MaterialsText> */}
          <SelectedColorText> {product.materials.join(", ")}  | {selectedColor} </SelectedColorText>
          <ColorSwatches>
            {product.colors.map((color: string, index: number) => (
              <ColorCircle
                key={index}
                $color={COLOR_MAP[color] ?? "transparent"} 
                $selectedColor={selectedColor === color}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </ColorSwatches>
        </ColorBoxContainer>
        <SizeBoxContainer>
          {/* <SizeText> 사이즈 | {selectedSize} </SizeText> */}
          <SizeBox>
            {product.availableSizes.map((size: string) => (
              <SizeItem
                key={size}
                $selectedSize={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </SizeItem>
            ))}
          </SizeBox>
        </SizeBoxContainer>
        <OptionBox>
          <OptionTop>
            <OptionText>
              {selectedColor} · {selectedSize}
            </OptionText>
          </OptionTop>
          <QuantityBox
            unitPrice={product.discountedPrice ?? product.price}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </OptionBox>
        <ButtonBox>
          <AddButton
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand,
              image: product.image,
              price: product.price,
              discountedPrice: product.discountedPrice,
              discountRate: product.discountRate,
              color: selectedColor,
              size: selectedSize,
              quantity: quantity,
            }}
          />
          <PurchaseButton></PurchaseButton>
        </ButtonBox>
        <ButtonBox>
          <AIButton></AIButton>
        </ButtonBox>
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

  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
`;

const ProductImage = styled.img`
  width: 600px;
  max-width: 600px;
  min-height: 430px;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  height: auto;
  order: 0;

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 100%;
    max-width: 510px;
  }
`;

const ProductSmallImagesContainer = styled.div`
  display: flex;
  gap: 8px;
  height: 100%;
  object-fit: cover;
  flex-flow: column nowrap;
  margin: 0px 4px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    order: 2;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
  }

  &::-webkit-scrollbar {
    display: none; // 스크롤바 숨기기 (선택 사항)
  }
`;

const ProductInfoBox = styled.div`
  width: 408px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  order: 3;
  margin: 0px 32px;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    margin: 0px 16px;
  }

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 100%;
  }
`;

const TopRow = styled.div`
  display: flex;
  min-width: 350px;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.div`
  font-family: "pretendard";
  font-weight: 500;
  font-size: 16px;
  color: black;
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const ProductName = styled.div`
  font-family: "pretendard";
  font-weight: 200;
  font-size: 24px;
  color: black;
`;

const Price = styled.div`
  font-family: "pretendard";
  font-weight: 200;
  color: black;
  font-size: 24px;
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DiscountPrice = styled.div`
  font-family: "pretendard";
  font-size: 24px;
  font-weight: 200;
  color: black;
`;

const OriginalPriceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OriginalPrice = styled.div`
  font-family: "pretendard";
  font-size: 14px;
  color: gray;
  text-decoration: line-through;
`;

const DiscountRate = styled.div`
  font-family: "pretendard";
  font-size: 12px;
  color: white;
  background-color: black;
  padding: 0px 2px;
  background-color: red;
`;

const Description = styled.p`
  white-space: pre-line;
  display: flex;
  font-family: "pretendard";
  font-size: 14px;
  font-weight: 500;
  color: black;
  text-align: left;
  padding: 16px 0px;
`;

const ColorBoxContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 16px 0px;
`; 

const SelectedColorText = styled.div`
  display: flex;
  font-size: 12px;
  font-family: "pretendard";
  color: black;
`;

const ColorSwatches = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const ColorCircle = styled.div<{ $color: string; $selectedColor?: boolean }>`
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 1px solid gray;
  box-sizing: border-box;

  ${(props) =>
    props.$selectedColor &&
    `
    &::after {
      content: "";
      align-items: center;
      position: absolute;
      top: -5px;
      left: -5px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #ccc; 
      box-sizing: border-box;
    }
  `}
`;

const SizeBoxContainer = styled.div`
  max-width: 408px;
  min-width: 350px;
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 16px 0px 16px 0px;
`; 

const SizeText = styled.div`
  display: flex;
  font-size: 12px;
  font-family: "pretendard";
  color: black;
`;

const SizeBox = styled.div`
  max-width: 408px;
  min-width: 350px;
  display: flex;
  gap: 8px;
`; 

const SizeItem = styled.div<{ $selectedSize?: boolean }>`
  position: relative; /* 추가 */
  width: 80px;
  height: 40px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "pretendard";
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  color: black;

  ${(props) =>
    props.$selectedSize &&
    `
    &::before {
      content: "";
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border: 2px solid #dfdfdf;
      pointer-events: none;
      box-sizing: border-box;
      z-index: 0;
    }
    position: relative;
    z-index: 1;
  `}

  @media (max-width: ${BREAKPOINTS.md}px) {
    min-width: 78px;
    color: black;
  }
`;

const OptionTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OptionText = styled.div`
  display: flex;
  font-size: 12px;
  font-family: "pretendard";
  color: black;
`;

const OptionBox = styled.div`
  min-width: 350px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 4px;
  background-color: #f5f5f5;
  padding: 12px 16px;
  box-sizing: border-box;
`;

const ButtonBox = styled.div`
  min-width: 350px;
  display: flex;
  gap: 8px;
  padding: 2px 0px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    justify-content: center;
    align-items: center;
  }
`; 

export { ProductContainer };
