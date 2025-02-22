import styled from "styled-components";
import { AdminProductCard } from "../../../shared";

function BrandProductList() {
  return (
    <Wrapper>
      <AdminProductCard id="1"></AdminProductCard>
      <AdminProductCard id="2"></AdminProductCard>
      <AdminProductCard id="3"></AdminProductCard>
      <AdminProductCard id="3"></AdminProductCard>
      <AdminProductCard id="3"></AdminProductCard>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

export { BrandProductList };
