import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import { fetchProductDetailByColor, fetchProductColors } from "@/entities/product/api/product.api";
import type { ProductDetail } from "@/entities/product";

import { BREAKPOINTS } from "@/shared";

import { ProductDetails } from "@/widgets/product-details";
import { ProductDescription } from "@/widgets/product-description";
import { ProductReviews } from "@/widgets/product-reviews";
import { ProductSizingInfo } from "@/widgets/product-sizing-info";

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [productColors, setProductColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get("tab") || "description";
  const color = searchParams.get("color");

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab: tab, color: color || "" });
  };

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const colors = await fetchProductColors(Number(id));
        if (!colors || colors.length === 0) {
          throw new Error("상품의 색상 정보를 찾을 수 없습니다.");
        }
        setProductColors(colors);

        let colorToLoad = color;
        if (!colorToLoad || !colors.includes(colorToLoad)) {
          colorToLoad = colors[0];
          navigate(`/products/${id}?color=${colorToLoad}&tab=${activeTab}`, { replace: true });
          return;
        }
        
        const detailData = await fetchProductDetailByColor(Number(id), colorToLoad);
        if (!detailData) {
          throw new Error(`'${colorToLoad}' 색상의 상세 정보를 찾을 수 없습니다.`);
        }
        setProduct(detailData);

      } catch (error) {
        console.error("Failed to load product details:", error);
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, color, navigate]);

  if (loading || !product) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <ProductDetails
        product={product}
        productColors={productColors}
        onColorChange={(newColor) => {
          navigate(`/products/${id}?color=${newColor}&tab=${activeTab}`);
        }}
      />
      
      <ContentArea>
        <TabMenu>
          <TabButton $active={activeTab === "description"} onClick={() => handleTabChange("description")}>상세설명</TabButton>
          <TabButton $active={activeTab === "size"} onClick={() => handleTabChange("size")}>사이즈표</TabButton>
          <TabButton $active={activeTab === "review"} onClick={() => handleTabChange("review")}>리뷰</TabButton>
          <TabButton $active={activeTab === "qna"} onClick={() => handleTabChange("qna")}>문의하기</TabButton>
        </TabMenu>
        <Divider />
      
        {activeTab === "description" && <ProductDescription />}
        {activeTab === "size" && <ProductSizingInfo />}
        {activeTab === "review" && <ProductReviews />}
      </ContentArea>
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
  position: relative;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 16px 16px;
  }
`;

const Divider = styled.div`
  margin-top: 16px;
  width: 100%;
  height: 1px;
  background: #e4e4e4;
  border-radius: 1000px;
`;

const TabMenu = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 64px;
  flex-wrap: nowrap;
  gap: 64px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 8px 32px;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#c3c3c3ff" : "#ffffffff")};
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
  white-space: nowrap;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 8px 8px;
  }
`;

const ContentArea = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 16px;
`;

export { ProductDetailPage };
