import styled from "styled-components";
import { COLOR_MAP } from "@/shared";
import { GlassBox } from "@/shared/components/glass-box";
import { SelectQuantity } from "@/features/select-quantiy";
import type { Dispatch, SetStateAction } from "react";

interface PriceData {
  original: number;
  discounted?: number;
}

type ProductOptionsProps = {
  productMaterials: string[];
  productColors: string[];
  sizesSorted: string[];
  price: PriceData;
  
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  
  handleColorChange: (color: string) => void;
  setSelectedSize: (size: string) => void;
  setQuantity: Dispatch<SetStateAction<number>>;
  disabled?: boolean;
};

export function ProductOptions({
  productMaterials,
  productColors,
  sizesSorted,
  price,
  selectedColor,
  selectedSize,
  quantity,
  handleColorChange,
  setSelectedSize,
  setQuantity,
  disabled = false,
}: ProductOptionsProps) {
  
  const discountedPrice = price.discounted ?? price.original;

  return (
    <>
      <ColorBoxContainer>
        <SelectedColorText>
          {productMaterials.join(", ")} | {selectedColor}
        </SelectedColorText>
        <ColorSwatches>
          {productColors.map((color) => (
            <ColorCircle
              key={color}
              $color={COLOR_MAP[color] ?? "transparent"}
              $selectedColor={selectedColor === color}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </ColorSwatches>
      </ColorBoxContainer>
      <SizeBoxContainer>
        <SizeBox>
          {sizesSorted.map((size) => (
            <SizeItem
              key={size}
              $selectedSize={selectedSize === size}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </SizeItem>
          ))}
        </SizeBox>
      </SizeBoxContainer>
      <OptionBox>
        <OptionTop>
          <OptionText>
            {selectedColor} · {selectedSize}
          </OptionText>
        </OptionTop>
        <SelectQuantity
          unitPrice={price.original}
          discountedPrice={discountedPrice}
          quantity={quantity}
          setQuantity={setQuantity}
          disabled={disabled}
        />
      </OptionBox>
    </>
  );
}

export const ColorBoxContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 16px 0px;
`;

export const SelectedColorText = styled.div`
  display: flex;
  font-size: 12px;
  color: #ffffff;
  padding-bottom:8px;
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
  border: 1px solid #b6b6b6;
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
      border: 2px solid #c4c4c4;
      box-sizing: border-box;
    }
  `}
`;

export const SizeBoxContainer = styled.div`
  max-width: 408px;
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 8px 0px 16px;
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