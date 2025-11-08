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
  max-width: 400px;
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
