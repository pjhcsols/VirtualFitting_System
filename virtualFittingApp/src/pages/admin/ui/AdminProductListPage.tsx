/* New design of Basilium */

import styled from "styled-components";
import { Pagination, SearchBar } from "../../../shared";
import { BrandProductList } from "../../../widgets";

function AdminProductListPage() {
  return (
    <Wrapper>
      <Title>출고 상품 목록</Title>
      <SearchBarContainer>
        <SearchBar />
      </SearchBarContainer>
      <ProductListContainer>
        <BrandProductList />
      </ProductListContainer>
      <Pagination currIdx={1} totalIdx={10} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 10px 100px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const Title = styled.h1`
  font-family: "studio-sans";
  font-size: 2vw;
  font-weight: 500;
  color: black;
`;

const SearchBarContainer = styled.div`
  box-sizing: border-box;
  padding: 0px 40px 0px 0px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ProductListContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

export { AdminProductListPage };
