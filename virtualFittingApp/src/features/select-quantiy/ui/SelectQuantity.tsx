import styled from "styled-components";
import icon_minus from "../assets/icon-minus.svg";
import icon_plus from "../assets/icon-plus.svg";
import type { QuantityProps } from "./types";

function SelectQuantity({ quantity, setQuantity, unitPrice, discountedPrice, disabled = false }: QuantityProps) {
  const increase = () => {
    if (disabled) return;
    setQuantity((q) => q + 1);
  };
  const decrease = () => {
    if (disabled) return;
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const hasDiscount = discountedPrice !== undefined && discountedPrice < unitPrice;

  return (
    <QuantityBoxWrapper>
      <QuantityBoxContainer>
        <QuantityButton onClick={decrease}>
          <Icon src={icon_minus} alt="minus" />
        </QuantityButton>
        <QuantityText>{quantity}</QuantityText>
        <QuantityButton onClick={increase}>
          <Icon src={icon_plus} alt="plus" />
        </QuantityButton>
      </QuantityBoxContainer>
      <PriceContainer>
        {hasDiscount && (
          <OriginalTotalPrice>
            {(unitPrice * quantity).toLocaleString()}원
          </OriginalTotalPrice>
        )}
        <FinalTotalPrice>
          {((discountedPrice ?? unitPrice) * quantity).toLocaleString()}원
        </FinalTotalPrice>
      </PriceContainer>
    </QuantityBoxWrapper>
  );
}

const QuantityBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const OriginalTotalPrice = styled.div`
  font-size: 13px;
  color: #aaa;
  text-decoration: line-through;
`;

const FinalTotalPrice = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
`;

export { SelectQuantity };