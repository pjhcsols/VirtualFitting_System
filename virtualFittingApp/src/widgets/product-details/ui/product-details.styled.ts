import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import { GlassBox } from "@/shared/components/glass-box";

export const ProductBox = styled.section`
  display: flex;
  width: 100%;
  max-width: 1200px;
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
`;

export const ImageCarouselContainer = styled.div`
  position: relative;
  width: 100%;
  order: 1;
  flex: 1 1 auto;
  min-width: 0;

  @media (max-width: ${BREAKPOINTS.md}px) {
    order: 1;
    flex: none;
  }
`;


export const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 750px;
  object-fit: cover;
object-position: center;
  height: auto;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);

  @media (max-width: ${BREAKPOINTS.lg}px) {
    max-width: 510px;
    max-height: 680px;
  }
`;

export const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 50%;
  z-index: 1;
  font-size: 20px;
  line-height: 1;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

export const Pagination = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
`;

export const Dot = styled.div<{ $isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isActive ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.5)")};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

export const ProductInfoBox = styled(GlassBox)`
  display: flex;
  flex-direction: column;
  order: 2;
  
  flex: 0 0 408px;
  color: white;
  padding: 32px;
  
  @media (max-width: ${BREAKPOINTS.lg}px) {
    flex-basis: 360px; 
  }

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 90%;
    margin: 0;
    padding: 1.5rem;
    flex: none;
  }
`;

export const TopRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const Brand = styled.div`
  font-family: "pretendard";
  font-weight: 500;
  font-size: 14px;
`;

export const IconImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  filter: invert(1);
`;

export const ProductName = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

export const PriceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DiscountPrice = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: white;
`;

export const Price = styled.div`
  font-family: "pretendard";
  font-weight: 600;
  font-size: 24px;
`;

export const OriginalPriceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const OriginalPrice = styled.div`
  font-size: 18px;
  text-decoration: line-through;
  color: #aaa;
`;

export const DiscountRate = styled.div`
  font-size: 21px;
  font-weight: 600;
  color: white;
  padding: 0px 3px;
  border-radius: 4px;
  background-color: #ff4d4d;
`;

export const Description = styled.p`
  white-space: pre-line;
  display: flex;
  font-family: "pretendard";
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  padding: 16px 0px;
`;

export const ColorBoxContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 16px 0px;
`;

export const SelectedColorText = styled.div`
  display: flex;
  font-size: 12px;
  font-family: "pretendard";
`;

export const ColorSwatches = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const ColorCircle = styled.div<{ $color: string; $selectedColor?: boolean }>`
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  box-sizing: border-box;
  border: 1px solid gray;
  cursor: pointer;

  ${(props) =>
    props.$selectedColor &&
    `
    &::after {
      content: "";
      position: absolute;
      top: -5px;
      left: -5px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #333;
      box-sizing: border-box;
    }
  `}

  @media (prefers-color-scheme: dark) {
    border: 1px solid #888;
    ${(props) =>
    props.$selectedColor &&
    `
    &::after {
      border: 2px solid #ffffff;
    }
  `}
  }
`;

export const SizeBoxContainer = styled.div`
  max-width: 408px;
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 16px 0px;
  margin-bottom: 4px;
`;

export const SizeBox = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const SizeItem = styled(GlassBox)<{ $selectedSize?: boolean }>`
  position: relative;
  width: 80px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "pretendard";
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  // border: 1px solid ${props => props.$selectedSize ? '#ffffff' : 'transparent'};
  background-color: ${props => props.$selectedSize ? '#ffffff' : 'transparent'};
  color: ${props => props.$selectedSize ? '#000000' : '#ffffff'};

  &:hover {
    border-color: #ffffff;
  }
`;

export const OptionTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const OptionText = styled.div`
  display: flex;
  font-size: 12px;
  font-family: "pretendard";
  color: #ffffff;

  @media (prefers-color-scheme: dark) {
    color: #ffffff;
  }
`;

export const OptionBox = styled(GlassBox)`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 12px;
  padding: 12px 16px;
  box-sizing: border-box;
  margin-bottom: 4px;
`;

export const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  padding: 2px 0px;

  @media (max-width: 420px) {
    flex-direction: column;
    gap: 12px;
    & > button {
      width: 100%;
    }
  }
  margin-top: 12px;
`;

export const TabOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
`;

export const TabContent = styled.div`
  padding: 20px;
  border-radius: 12px;
  min-width: 460px;
  max-height: 520px;
  overflow-y: auto;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.3);

  h3 {
    color: black;
  }

  @media (prefers-color-scheme: dark) {
    backdrop-filter: blur(15px);
    background: rgba(20, 20, 20, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    h3 {
      color: #fafafa;
    }
  }

  @media (max-width: ${BREAKPOINTS.sm}px) {
    min-width: 90%;
    max-width: 90%;
  }
`;

export const PaymentMethodContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

export const PaymentMethodButton = styled.button<{ $selected: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${props => props.$selected ? '#000' : '#ddd'};
  background-color: ${props => props.$selected ? '#000' : 'white'};
  color: ${props => props.$selected ? 'white' : 'black'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    border-color: #000;
  }
`;

export const PaymentInfo = styled.div`
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;

  div {
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
    text-align: left;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const PaymentButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin: 16px 0;

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #252525;
  }
`;
