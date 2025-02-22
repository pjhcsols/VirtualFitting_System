import { ProductContainer } from "@/widgets";
import styled from "styled-components";

function AdminProductPage() {
  return (
    <Wrapper>
      <Title>출고 상품 상세보기</Title>
      <ProductContainer />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 10px 60px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const Title = styled.h1`
  font-family: "Prata-Regular";
  font-size: 3vw;
  color: black;
`;

export { AdminProductPage };
