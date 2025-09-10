import styled from "styled-components";

import type { ProductInputType } from "@/pages/admin/types/Product";
import { Link } from "react-router-dom";

type StoreProductType = {
  product: ProductInputType;
};

function StoreProduct({ product }: StoreProductType) {
  //   const { isLiked, onChange, onClickHeart, onSubmit, productOptions } =
  //     useStoreProduct(product.productId);
  return <Wrapper to={`/store/${product.productId}`}></Wrapper>;
}

const Wrapper = styled(Link)``;

export { StoreProduct };
