import { useState } from "react";
import styled from "styled-components";
import { ICON_MINUS, ICON_PLUS } from "@/shared";

type QuantityBoxProps = {
  initialQuantity?: number;
  unitPrice: number;
};

function QuantityBox({ initialQuantity = 1, unitPrice }: QuantityBoxProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const totalPrice = unitPrice * quantity;

  return (
    <QuantityBoxWrapper>
      <QuantityBoxContainer>
        <QuantityButton onClick={decrease}>
          <Icon src={ICON_MINUS} alt="minus" />
        </QuantityButton>
        <QuantityText>{quantity}</QuantityText>
        <QuantityButton onClick={increase}>
          <Icon src={ICON_PLUS} alt="plus" />
        </QuantityButton>
      </QuantityBoxContainer>
      <PriceText>{totalPrice.toLocaleString()}원</PriceText>
    </QuantityBoxWrapper>
  );
}

const QuantityBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-family: "Pretendard", sans-serif;
`;

const QuantityBoxContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  overflow: hidden;
  width: fit-content;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Icon = styled.img`
  width: 12px;
  height: 12px;
`;

const QuantityText = styled.div`
  width: 48px;
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  color: black;
  text-align: center;
  background-color: white;
  border-left: 1px solid #e4e4e4;
  border-right: 1px solid #e4e4e4;
`;

const PriceText = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: black;
`;

export { QuantityBox };