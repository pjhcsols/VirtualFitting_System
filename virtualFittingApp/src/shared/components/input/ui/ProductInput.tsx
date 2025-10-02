import React, { ChangeEvent } from "react";
import styled from "styled-components";

type InputType = {
  text: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

function ProductNameInput({ text, onChange, placeholder }: InputType) {
  return (
    <ProductNameInputBox>
      <ProductName value={text} onChange={onChange} />
      <ProductNamePlaceholder>
        {placeholder ?? "Enter the text"}
      </ProductNamePlaceholder>
    </ProductNameInputBox>
  );
}

function ProductPriceInput({ text, onChange, placeholder }: InputType) {
  return (
    <ProductNameInputBox>
      <ProductName value={text} onChange={onChange} />
      <ProductNamePlaceholder>
        {placeholder ?? "Enter the text"}
      </ProductNamePlaceholder>
    </ProductNameInputBox>
  );
}

function ProductDescription({ text, onChange, placeholder }: InputType) {
  return (
    <ProductNameInputBox>
      <ProductName value={text} onChange={onChange} />
      <ProductNamePlaceholder>
        {placeholder ?? "Enter the text"}
      </ProductNamePlaceholder>
    </ProductNameInputBox>
  );
}

type ProductMaterialType = {
  children: React.ReactNode;
};

function ProductMaterial({ children }: ProductMaterialType) {
  return <ProductMaterialButton>{children}</ProductMaterialButton>;
}

type ProductColorType = {
  color?: string;
  isClicked: boolean;
  onClick: () => void;
};

function ProductColor({ color, isClicked = false, onClick }: ProductColorType) {
  return (
    <ProductColorButton color={color} isClicked={isClicked} onClick={onClick} />
  );
}

type ProductSizeType = {
  isClicked: boolean;
  children: React.ReactNode;
};

function ProductSize({ isClicked, children }: ProductSizeType) {
  return <ProductSizeButton clicked={isClicked}>{children}</ProductSizeButton>;
}

export {
  ProductNameInput,
  ProductPriceInput,
  ProductMaterial,
  ProductColor,
  ProductDescription,
  ProductSize,
};

const DefaultInput = styled.input.attrs({ type: "text" })`
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding: 0 30px;
  line-height: 40px;
  border: 1px solid #121212;
  border-radius: 5px;
  outline: none;
  background-color: transparent;
  transition: 0.1s ease;
  z-index: 10;
  &:focus {
    color: #121518;
    border: 4px solid #121518;
  }
  &:focus + label {
    color: #121518;
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    background-color: #fffafa;
    transform: translate(-10%, -45%) scale(0.88);
    z-index: 10;
  }
`;

const DefaultOutline = styled.label`
  left: 0;
  position: absolute;
  font-size: 1.2rem;
  color: #121518;
  padding: 0 10px;
  margin: 0 20px;
  transition: 0.2s ease;
`;

const DefaultButton = styled.div`
  width: 90px;
  height: 40px;
  aspect-ratio: 9/4;
  border: 1px solid #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ProductNameInputBox = styled.div`
  width: 100%;
  height: 45px;
  line-height: 45px;
  position: relative;
`;

const ProductName = styled(DefaultInput)``;

const ProductNamePlaceholder = styled(DefaultOutline)``;

const ProductColorButton = styled(DefaultButton)<{
  color?: string;
  isClicked: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background-color: ${(props) => props.color ?? "#121212"};
  transition: 0.25s all ease-out;
  transform: ${(props) => props.isClicked && "translateY(-10px) scale(1.02)"};
  cursor: pointer;
`;

const ProductMaterialButton = styled(DefaultButton)`
  font-size: 0.7rem;
  font-weight: 600;
  color: black;
`;

const ProductSizeButton = styled(DefaultButton)<{ clicked: boolean }>`
  font-size: 0.65rem;
  font-weight: 500;
  color: black;
`;
