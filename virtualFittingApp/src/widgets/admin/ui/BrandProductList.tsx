import styled from "styled-components";
import { AdminProductCard } from "../../../shared";

function BrandProductList() {
  return (
    <Wrapper>
      <AdminProductCard></AdminProductCard>
      <AdminProductCard></AdminProductCard>
      <AdminProductCard></AdminProductCard>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

export { BrandProductList };
