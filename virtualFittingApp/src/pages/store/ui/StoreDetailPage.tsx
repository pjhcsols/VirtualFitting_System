import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import { fetchOnSaleProducts, fetchProductDetailByColor, fetchProductColors } from "../api/products.action";
import type { ProductDetail } from "@/shared";

import { BREAKPOINTS } from "@/shared";
import {
  DetailDescription,
  SizeInfo,
  ProductContainer,
  ReviewContent,
} from "@/widgets";

function StoreDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [color, setColor] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [productColors, setProductColors] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const productList = await fetchOnSaleProducts();
        const currentProduct = productList.find(p => p.productId === Number(id));
        if (!currentProduct) {
          console.error("상품 없음");
          return;
        }

        const colorsResponse = await fetchProductColors(Number(id));
        setProductColors(colorsResponse); 

        let requestedColor = searchParams.get("color");
        if (!requestedColor || !colorsResponse.includes(requestedColor)) {
          requestedColor = colorsResponse[0];
          navigate(`?color=${requestedColor}`, { replace: true });
        }

        const detailData = await fetchProductDetailByColor(Number(id), requestedColor);
        setProduct(detailData);
        setColor(requestedColor);

      } catch (error) {
        console.error(error);
      }
    };

    loadProduct();
  }, [id, searchParams]);

  if (!product || !color) return <div>Loading...</div>;

  return (
    <Wrapper>
      <ProductContainer product={product} productColors={productColors} onColorChange={(c) => {
        navigate(`?color=${c}`);
      }} />
      <Divider />
      <DetailDescription />
      <SizeInfo />
      <ReviewContent />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 16px 0px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 16px 16px;
  }
`;

const Divider = styled.div`
  margin-top: 64px;
  width: 100%;
  height: 1px;
  background: #e4e4e4;
  border-radius: 1000px;
`;

export { StoreDetailPage };
