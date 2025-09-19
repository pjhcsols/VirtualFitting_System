import { Size } from "@/shared";
import { ProductSizeOptionType } from "@/shared/types/product/product";
import styled from "styled-components";

interface ISizeInput {
  sizeValue: ProductSizeOptionType[];
}

function SizeInput({ sizeValue }: ISizeInput) {
  const sizes: Size[] = ["S", "M", "L", "XL"];
  return (
    <Wrapper>
      <Header>
        <HeaderColumn>사이즈</HeaderColumn>
        <HeaderColumn>팔 길이</HeaderColumn>
        <HeaderColumn>가슴 길이</HeaderColumn>
        <HeaderColumn>총장</HeaderColumn>
        <HeaderColumn>재고</HeaderColumn>
      </Header>
      {sizes.map((item: Size, key) => {
        return <Column key={key}></Column>;
      })}
    </Wrapper>
  );
}

export { SizeInput };

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  &:last-child {
    border-bottom: none;
  }
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const HeaderColumn = styled.div`
  min-width: 4rem;
  width: 20%;
  min-height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eaeaea;
  border-right: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  font-size: 0.8rem;
  font-weight: 700;
  color: black;
  &:last-child {
    border-right: none;
  }
`;

const Column = styled.div`
  width: 100%;
  min-height: 4rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  border-right: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  &:last-child {
    border-right: none;
  }
`;

const ColumnCell = styled.div`
  min-width: 4rem;
  width: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.6rem;
  font-weight: 500;
  color: black;
`;

const ColumnInput = styled.input.attrs({ type: "text" })`
  min-width: 4rem;
  width: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.6rem;
  font-weight: 500;
  color: black;
  &:focus {
    outline: none;
  }
`;
