import { useState } from "react";
import styled from "styled-components";

import { ClientProductDto } from "@/shared";
import { SizeTable } from "@/pages/brand/components";

function BrandProductCreate() {
  const [productInfo, setProductInfo] = useState<ClientProductDto>({
    productId: 0,
    status: "ON SALE",
    productCategory: {
      categoryId: 0,
      categoryName: "",
    },
    productName: "",
    productPrice: 0,
    productMaterial: [],
    productDesc: "",
    totalQuantity: 0,
    productOptions: [],
    productSizeOptions: [],
    productColorOptions: [],
    version: 0,
  });

  return (
    <Wrapper>
      <InfoWrapper>
        <PhotoContainer></PhotoContainer>
        <InfoContainer></InfoContainer>
      </InfoWrapper>
      <SizeContainer>
        <SizeTable />
      </SizeContainer>
    </Wrapper>
  );
}

export { BrandProductCreate };

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 2rem 4rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const InfoWrapper = styled.section`
  position: relative;
  box-sizing: border-box;
  padding: 2rem 3rem;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
`;

const PhotoContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoContainer = styled.div`
  position: relative;
  width: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

const SizeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ButtonDefault = styled.div`
  appearance: none;
  background-color: transparent;
  border: 2px solid #1a1a1a;
  border-radius: 15px;
  box-sizing: border-box;
  color: #3b3b3b;
  cursor: pointer;
  display: inline-block;
  font-family: "Pretendard";
  font-size: 16px;
  font-weight: 600;
  color: black;
  line-height: normal;
  margin: 0;
  width: 40%;
  min-height: 45px;
  min-width: 140px;
  outline: none;
  padding: 16px 24px;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  will-change: transform;
  &:disabled {
    pointer-events: none;
  }
  &:hover {
    color: #fff;
    background-color: #1a1a1a;
    box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
    transform: translateY(-2px);
  }
  &:active {
    box-shadow: none;
    transform: translateY(0);
  }
`;

const SizeTableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const ColorContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;
