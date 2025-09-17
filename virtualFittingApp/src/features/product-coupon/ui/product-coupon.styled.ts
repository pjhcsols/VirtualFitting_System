import styled from "styled-components";

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