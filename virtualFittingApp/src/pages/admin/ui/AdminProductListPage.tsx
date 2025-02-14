/* New design of Basilium */

import styled from "styled-components";
import { Pagination, SearchBar } from "../../../shared";
import { BrandProductList } from "../../../widgets";

function AdminProductListPage() {
  return (
    <Wrapper>
      <Title>출고 상품 목록</Title>
      <SearchBar />
      <ProductListContainer>
        <BrandProductList />
      </ProductListContainer>
      <Pagination currIdx={1} totalIdx={10} />
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
  font-size: 2em;
  color: black;
`;

const ProductListContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

const TableColumn = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export { AdminProductListPage };
