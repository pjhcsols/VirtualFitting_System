import styled, { createGlobalStyle } from "styled-components";

type ProductCardProps = {
  product: any;
  onClick?: () => void;
};

function ProductCard({ product, onClick }: ProductCardProps) {
  const maxVisibleColors = 3;
  const visibleColors = product.colors.slice(0, maxVisibleColors);
  const remainingColors = product.colors.length - maxVisibleColors;

  return (
    <>
      <FontStyle />
      <Card onClick={onClick}>
          <ImageBox>
            <img src={product.image} alt={product.name} />
          </ImageBox>
          <InfoBox>
            <Name>{product.name}</Name>
            <ColorPriceRow>
              <ColorSwatches>
                {visibleColors.map((color: string, index: number) => (
                  <ColorCircle key={index} $color={color} />
                ))}
                {remainingColors > 0 && (
                  <ExtraText>+{remainingColors}</ExtraText>
                )}
              </ColorSwatches>
              <Price>￦{product.price}</Price>
            </ColorPriceRow>
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
  cursor: pointer;

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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const InfoBox = styled.div`
  padding: 0.75em 0.5em;
`;

const Name = styled.div`
  display: flex;
  font-size: 0.8em;
  font-weight: 400;
  color: black;
  font-family: 'Inter', sans-serif;
`;

const ColorPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5em;
`;

const ColorSwatches = styled.div`
  display: flex;
  gap: 4px;
`;

const ColorCircle = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 1px solid black;
`;

const ExtraText = styled.div`
  font-size: 0.75em;
  color: black;
`;

const Price = styled.div`
  font-size: 0.8em;
  color: black;
  font-family: 'HelveticaNeueLight', sans-serif;
`;

export { ProductCard };
