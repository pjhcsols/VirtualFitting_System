import styled, { keyframes } from "styled-components";
import { BREAKPOINTS } from "@/shared";
import { GlassBox } from "@/shared/components/glass-box";

export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${rotate} 0.8s linear infinite;
  margin-bottom: 10px;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 18px; /* 이미지 border-radius와 일치 */
  z-index: 50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  backdrop-filter: blur(2px);
`;

export const LoadingText = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0;
`;

export const ProductBox = styled.section`
  display: flex;
  width: 100%;
  max-width: 1200px;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
`;

export const ImageCarouselContainer = styled.div`
  position: relative;
  max-width: 600px;
  max-height: 600px;
  flex: 1 1 auto;
  display: flex;
`;

export const ProductImage = styled.img`
  width: 100%; 
  max-height: 600px;
  object-fit: cover;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.37);

  @media (max-width: ${BREAKPOINTS.lg}px) {
    max-width: 510px;
    max-height: 680px;
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%; 
  margin: 0 auto;

  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FittingButton = styled.button`
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 10px;
  right: 10px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.1);
  }

  z-index: 10;
`;

export const FittingResultButton = styled.button`
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 10px;
  right: 10px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
  background-color: rgba(174, 174, 174, 0.4);
  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.4);
    // background-color: rgba(255, 255, 255, 0.1);
  }

  z-index: 10;
`;


export const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  background-color: rgba(0,0,0,0.45);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0,0,0,0.7);
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
  color: #d7d7d7;
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
