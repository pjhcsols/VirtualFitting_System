import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import { fetchProductDetailByColor, fetchProductColors } from "../api/products.action";
import type { ProductDetail } from "@/shared";

import { BREAKPOINTS } from "@/shared";
import {
  DetailDescription,
  SizeInfo,
  ProductContainer,
  ReviewContent,
} from "@/widgets";

function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); //

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [productColors, setProductColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get("tab") || "description";
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab: tab, color: searchParams.get("color") || "" });
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

        let colorToLoad = searchParams.get("color");
        if (!colorToLoad || !colors.includes(colorToLoad)) {
            colorToLoad = colors[0];
        }
        
        const detailData = await fetchProductDetailByColor(Number(id), colorToLoad);
        if (!detailData) {
          throw new Error(`'${colorToLoad}' 색상의 상세 정보를 찾을 수 없습니다.`);
        }
        setProduct(detailData);
        
        const currentTab = searchParams.get("tab") || "description";
        const currentUrlColor = searchParams.get("color");
        if (currentUrlColor !== colorToLoad) {
            navigate(`/store/${id}?color=${colorToLoad}&tab=${currentTab}`, { replace: true });
        }

      } catch (error) {
        console.error("Failed to load product details:", error);
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, searchParams, navigate]);

  if (loading || !product) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <ProductContainer
        product={product}
        productColors={productColors}
        onColorChange={(newColor) => {
          navigate(`/store/${id}?color=${newColor}&tab=${activeTab}`);
        }}
      />
      
      <ContentArea>
        <TabMenu>
          <TabButton $active={activeTab === "description"} onClick={() => setActiveTab("description")}>상세설명</TabButton>
          <TabButton $active={activeTab === "size"} onClick={() => setActiveTab("size")}>사이즈표</TabButton>
          <TabButton $active={activeTab === "review"} onClick={() => setActiveTab("review")}>리뷰</TabButton>
          <TabButton $active={activeTab === "qna"} onClick={() => setActiveTab("qna")}>문의하기</TabButton>
        </TabMenu>
        <Divider />
      
        {activeTab === "description" && <DetailDescription />}
        {activeTab === "size" && <SizeInfo />}
        {activeTab === "review" && <ReviewContent />}
        {/* {activeTab === "qna" && <QnaContent />} */}
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

const TabButton = styled.button<{ $active: boolean }>` //navlink
  padding: 8px 32px;
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#000" : "#777")};
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

export { StoreDetailPage };
