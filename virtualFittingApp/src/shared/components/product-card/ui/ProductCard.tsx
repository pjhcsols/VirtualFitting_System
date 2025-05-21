import styled, { createGlobalStyle } from "styled-components";
import { useState } from "react";
import { ColorPopup } from "./ColorPopUp";
import { LikeButton } from "@/shared";

type ProductCardProps = {
  product: any;
  onClick?: () => void;
};

function ProductCard({ product, onClick }: ProductCardProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const maxVisibleColors = 3;
  const visibleColors = product.colors.slice(0, maxVisibleColors);
  const remainingColors = product.colors.length - maxVisibleColors;

  return (
    <>
      <FontStyle />
      <Card onClick={onClick}>
        <ImageBox>
          <img src={product.image} alt={product.name} />
          <LikeButtonWrapper >
            <LikeButton />
          </LikeButtonWrapper>
          <ColorSwatches>
            {visibleColors.map((color: string, index: number) => (
              <ColorCircle key={index} $color={color} />
            ))}
            {remainingColors > 0 && (
              <ExtraIcon
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPopupOpen(true);
                }}
              >
                +more
              </ExtraIcon>
            )}
          </ColorSwatches>
          {isPopupOpen && (
          <ColorPopup colors={product.colors} onClose={() => setIsPopupOpen(false)}/>
          )}
        </ImageBox>
          <InfoBox>
            <Brand>{product.brand}</Brand>
            <Name>{product.name}</Name>
            <PriceBox>
              {product.discountRate && (
                <DiscountRate>{product.discountRate}%</DiscountRate>
              )}
              <PriceRow>
                {product.discountRate ? (
                  <>
                    <OriginalPrice>￦{product.price}</OriginalPrice>
                    <DiscountedPrice>￦{product.discountedPrice}</DiscountedPrice>
                  </>
                ) : (
                  <Price>￦{product.price}</Price>
                )}
              </PriceRow>
            </PriceBox>
          </InfoBox>
        </Card>
      </>
    );
  }

export const xlDouble = 1536;
export const xl = 1280;
export const lg = 1024;
export const md = 768;
export const sm = 640;

const FontStyle = createGlobalStyle`
  @font-face {
    font-family: 'Inter';
    src: url('/font/Inter-VariableFont_opsz,wght.ttf') format('truetype');
    font-weight: 100 900;
    font-style: normal;
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  // cursor: pointer;

  @media (max-width: ${sm - 1}px) {
    &:not(:first-child) {
      border-top: none;
    }
  }

  @media (min-width: ${sm}px) and (max-width: ${md - 1}px) {
    &:nth-child(even) {
      border-left: none;
    }

    &:nth-child(n + 3) {
      border-top: none;
    }
  }

  @media (min-width: ${md}px) and (max-width: ${xl - 1}px) {
    &:not(:nth-child(3n - 2)) {
      border-left: none;
    }

    &:nth-child(n + 4) {
      border-top: none;
    }
  }

  @media (min-width: ${xl}px) {
    &:not(:nth-child(4n - 3)) {
      border-left: none;
    }

    &:nth-child(n + 5) {
      border-top: none;
    }
  }
`;

const ImageBox = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-bottom: 1px solid black;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const InfoBox = styled.div`
  padding: 0.5em 0.5em;
`;

const Brand = styled.div`
  display: flex;
  font-size: 0.7em;
  font-weight: 400;
  color: black;
  font-family: 'Inter', sans-serif;
  text-decoration: underline;
  cursor: pointer;
`;

const Name = styled.div`
  display: flex;
  font-size: 0.8em;
  font-weight: 400;
  color: black;
  font-family: 'Inter', sans-serif;
`;

const PriceBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2em;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2em;
`;

const DiscountRate = styled.div`
  font-size: 0.5em;
  background-color: red;
  color: white;
  padding: 0em 0.4em;
`;

const OriginalPrice = styled.div`
  font-size: 0.8em;
  color: black;
  text-decoration: line-through;
  text-decoration-color: red;
  font-family: 'HelveticaNeueLight', sans-serif;
`;

const DiscountedPrice = styled.div`
  font-size: 0.8em;
  color: red;
  font-weight: 600;
  font-family: 'HelveticaNeueLight', sans-serif;
`;

const Price = styled.div`
  font-size: 0.8em;
  color: black;
  font-family: 'HelveticaNeueLight', sans-serif;
`;

const ColorSwatches = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  z-index: 2;
`;

const ColorCircle = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 1px solid black;
`;

const LikeButtonWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  width: 36px;
  height: 36px;
`;

const ExtraIcon = styled.div`
  width: 32px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  color: black;
  cursor: pointer;
`;

const ExtraText = styled.div`
  font-size: 0.75em;
  color: black;
`;


export { ProductCard };
