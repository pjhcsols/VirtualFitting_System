import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";

export const ProductBox = styled.section`
  display: flex;
  gap: 4px;
  width: 100%;
  max-width: 1200px;
  flex-direction: row;
  align-items: flex-start;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    flex-direction: column;
    align-items: center;
    gap: 32px;
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

export const ProductImage = styled.img`
  width: 100%;
  max-width: 600px;
  max-height: 750px;
  object-fit: cover;
  height: auto;
  order: 0;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    max-width: 510px;
    max-height: 680px;
  }
`;

export const ProductSmallImagesContainer = styled.div`
  display: flex;
  gap: 8px;
  height: 100%;
  object-fit: cover;
  flex-flow: column nowrap;
  margin: 0px 4px;

  @media (max-width: ${BREAKPOINTS.lg}px) {
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
    display: none;
  }
`;

export const ProductInfoBox = styled.div`
  width: 408px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  order: 3;
  margin: 0px 24px;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    width: 100%;
  }
`;

export const TopRow = styled.div`
  display: flex;
  min-width: 350px;
  justify-content: space-between;
  align-items: center;
`;

export const Brand = styled.div`
  font-family: "pretendard";
  font-weight: 500;
  font-size: 16px;
  color: black;
`;

export const IconImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

export const ProductName = styled.div`
  font-family: "pretendard";
  font-weight: 400;
  font-size: 24px;
  color: black;
`;

export const Price = styled.div`
  font-family: "pretendard";
  font-weight: 500;
  color: black;
  font-size: 24px;
`;

export const PriceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DiscountPrice = styled.div`
  font-family: "pretendard";
  font-size: 24px;
  font-weight: 500;
  color: red;
`;

export const OriginalPriceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const OriginalPrice = styled.div`
  font-family: "pretendard";
  font-size: 14px;
  color: gray;
  text-decoration: line-through;
`;

export const DiscountRate = styled.div`
  font-family: "pretendard";
  font-size: 12px;
  color: white;
  background-color: black;
  padding: 0px 2px;
  background-color: red;
`;

export const Description = styled.p`
  white-space: pre-line;
  display: flex;
  font-family: "pretendard";
  font-size: 14px;
  font-weight: 500;
  color: black;
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
  color: black;
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

export const SizeBoxContainer = styled.div`
  max-width: 408px;
  min-width: 350px;
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 16px 0px 16px 0px;
`;

export const SizeBox = styled.div`
  max-width: 408px;
  min-width: 350px;
  display: flex;
  gap: 8px;
`;

export const SizeItem = styled.div<{ $selectedSize?: boolean }>`
  position: relative;
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

  @media (max-width: ${BREAKPOINTS.lg}px) {
    min-width: 78px;
    color: black;
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
  color: black;
`;

export const OptionBox = styled.div`
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

export const ButtonBox = styled.div`
  min-width: 350px;
  display: flex;
  gap: 8px;
  padding: 2px 0px;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    justify-content: center;
    align-items: center;
  }
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
`;

export const TabContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 460px;
  max-height: 520px;
  overflow-y: auto;

  h3 {
    color: black;
  }

`;

export const CouponButton = styled.button`
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid #dfdfdf;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  color: black;
`;

export const CouponPopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 16px;
`;

export const CouponPopupContent = styled.div`
  position: relative;
  background-color: #f9f9f9;
  padding: 24px 32px;
  color: black;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::before {
    content: "발급 가능한 쿠폰";
    font-size: 20px;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin-bottom: 8px;
  }
`;

export const CouponItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;

export const CouponItem = styled.div<{ disabled?: boolean }>`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-left: 5px solid ${props => props.disabled ? '#cccccc' : '#000'};
  border-radius: 8px;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 4px 16px;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  }

  div:nth-of-type(1) {
    grid-column: 1 / 2;
    font-weight: 600;
    font-size: 16px;
    color: #333;
  }

  div:nth-of-type(2) {
    grid-column: 1 / 2;
    font-size: 14px;
    color: #e53935;
  }

  div:nth-of-type(3) {
    grid-column: 1 / 2;
    font-size: 13px;
    color: #666;
  }
`;

export const UseButton = styled.button`
  grid-column: 2 / 3;
  grid-row: 1 / 4;
  align-self: center;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000;
  }
`;

export const DisabledText = styled.div`
  grid-column: 2 / 3;
  grid-row: 1 / 4;
  align-self: center;
  font-size: 14px;
  font-weight: 500;
  color: #999;
  text-align: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #888;
  line-height: 1;
  padding: 0;

  &:hover {
    color: #333;
  }
`;

export const CouponDisplayBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f0f8ff;
  border: 1px solid #b0e0e6;
  border-radius: 4px;
  margin-top: 12px;
`;

export const CouponInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CouponLabel = styled.span`
  font-size: 12px;
  color: #555;
`;

export const CouponDetails = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #007bff;
`;

export const CouponRemoveButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #aaa;
  cursor: pointer;
  padding: 0 4px;

  &:hover {
    color: #333;
  }
`;