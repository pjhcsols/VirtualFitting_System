import styled, { createGlobalStyle } from "styled-components";
import { useState } from "react";
import { ColorPopup } from "./ColorPopUp";
import { LikeButton } from "@/shared";
import { BREAKPOINTS } from "@/shared";
import { COLOR_MAP } from "@/shared";

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
      <Card onClick={onClick}>
        <ImageBox>
          <img src={product.image} alt={product.name} />
          <LikeButtonWrapper >
            <LikeButton />
          </LikeButtonWrapper>
          <ColorSwatches>
            {visibleColors.map((color: string, index: number) => (
              <ColorCircle key={index} $color={COLOR_MAP[color] ?? "transparent"}  />
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
                    <OriginalPrice>￦{product.price.toLocaleString()}</OriginalPrice>
                    <DiscountedPrice>￦{product.discountedPrice.toLocaleString()}</DiscountedPrice>
                  </>
                ) : (
                  <Price>￦{product.price.toLocaleString()}</Price>
                )}
              </PriceRow>
            </PriceBox>
          </InfoBox>
        </Card>
      </>
    );
  }

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;

  @media (max-width: ${BREAKPOINTS.sm - 1}px) {
    &:not(:first-child) {
      border-top: none;
    }
  }

  @media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.md - 1}px) {
    &:nth-child(even) {
      border-left: none;
    }

    &:nth-child(n + 3) {
      border-top: none;
    }
  }

  @media (min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.xl - 1}px) {
    &:not(:nth-child(3n - 2)) {
      border-left: none;
    }

    &:nth-child(n + 4) {
      border-top: none;
    }
  }

  @media (min-width: ${BREAKPOINTS.xl}px) {
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
  font-family: "pretendard";
  font-size: 0.75em;
  font-weight: 400;
  color: black;
  text-decoration: underline;
  cursor: pointer;
`;

const Name = styled.div`
  display: flex;
  font-family: "pretendard";
  font-size: 0.8em;
  font-weight: 400;
  color: black;
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
  font-family: "pretendard";
`;

const DiscountedPrice = styled.div`
  font-size: 0.8em;
  color: red;
  font-weight: 400;
  font-family: "pretendard";
`;

const Price = styled.div`
  font-size: 0.8em;
  color: black;
  font-family: "pretendard";

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
  width: 24px;
  height: 24px;
`;

const ExtraIcon = styled.div`
  width: 32px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "pretendard";
  color: black;
  cursor: pointer;
`;

const ExtraText = styled.div`
  font-size: 0.75em;
  color: black;
`;


export { ProductCard };
