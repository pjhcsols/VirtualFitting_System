import { ChangeEvent, useState } from "react";
import { findProduct } from "../../api/admin.action";
import { Product, SearchBar } from "@/shared";
import styled from "styled-components";
import { ProductCard } from "@/entities/product";

function ProductFinder() {
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);

  const onChangeSearchBar = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchProduct(value);
  };

  const onSearchProduct = async () => {
    if (searchProduct.length === 0) {
      return;
    }
    try {
      const res = await findProduct({ productName: searchProduct });
      setProducts(res.data);
    } catch (err) {
      if (err instanceof CustomException) {
        return err;
      }
      return err;
    }
  };

  return (
    <Wrapper>
      <SearchContainer>
        <SearchBar
          onChangeFunc={onChangeSearchBar}
          onSearchFunc={onSearchProduct}
        />
      </SearchContainer>
      <ProductContainer>
        {products.map((item: Product, key: number) => {
          return <ProductCard product={item} key={key} />;
        })}
      </ProductContainer>
    </Wrapper>
  );
}

export { ProductFinder };

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ProductContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;
