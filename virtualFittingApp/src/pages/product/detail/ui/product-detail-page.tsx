import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import { fetchProductDetailByColor, fetchProductColors } from "@/entities/product/api/product.api";
import type { ProductDetail } from "@/entities/product";
import { BREAKPOINTS } from "@/shared";
import { ProductDetails } from "@/widgets/product-details";
import { ProductDescription } from "@/widgets/product-description";
import { ProductReviews } from "@/widgets/product-reviews";
import { ProductSizingInfo } from "@/widgets/product-sizing-info";
import { ProductQnAs } from "@/widgets/product-qnas";

import { AddModelModal } from "@/features/ai-try-on";

import { Cookies } from "react-cookie";
import { NormalUserGetImg } from "@/widgets/auth/api/normalAuth.action";

const cookies = new Cookies();

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
    setSearchParams({ tab, color: color || "" });
  };

  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const [registeredImageUrl, setRegisteredImageUrl] = useState<string | null>(null);
  const [registeredLoading, setRegisteredLoading] = useState(false);

  const requireAuth = () => {
    const token = cookies.get("access-token");
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return false;
    }
    return true;
  };

  const loadRegisteredImage = useCallback(async () => {
    setRegisteredLoading(true);
    try {
      const res = await NormalUserGetImg();
      const ImgUrl = "http://" + res.data; 
      setRegisteredImageUrl(ImgUrl);
      return ImgUrl;
    } catch {
      setRegisteredImageUrl(null);
      return null;
    } finally {
      setRegisteredLoading(false);
    }
  }, []);

  const openTryOn = async () => {
    if (!requireAuth()) return;
    setTryOnOpen(true);
    await loadRegisteredImage();
  };

  const closeTryOn = () => {
    setTryOnOpen(false);
    if (uploadPreview?.startsWith("blob:")) URL.revokeObjectURL(uploadPreview);
    setUploadPreview(null);
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadPreview(prev => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return prev;
    });

    const url = URL.createObjectURL(file);
    setUploadPreview(url);
  };

  const handleUseExisting = () => {
    closeTryOn();
  };

  
  const handleConfirmUpload = async () => {
    if (!uploadPreview) return;

    try {
      const latest = await loadRegisteredImage();
      if (latest) {
        
      }

      closeTryOn();
    } catch (e) {
      console.error(e);
      alert("이미지 등록에 실패했습니다.");
    }
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
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, color, navigate]);

  if (loading || !product) {
    return <div>Loading...</div>;
  }
  const currentProductId = product.productId;

  return (
    <Wrapper>
      <ProductDetails
        product={product}
        productColors={productColors}
        onColorChange={(newColor) => {
          setSearchParams({ tab: activeTab, color: newColor });
        }}
        onTryOn={openTryOn} 
      />

      <AddModelModal
        open={tryOnOpen}
        onClose={closeTryOn}
        registeredLoading={registeredLoading}
        registeredImageUrl={registeredImageUrl}
        onUseExisting={handleUseExisting}
        onFileChange={handleFileChange}
        onConfirmUpload={handleConfirmUpload}
        previewUrl={uploadPreview}
      />

      <ContentArea>
        <TabMenu>
          <TabButton $active={activeTab === "description"} onClick={() => handleTabChange("description")}>상세설명</TabButton>
          <TabButton $active={activeTab === "size"} onClick={() => handleTabChange("size")}>사이즈표</TabButton>
          <TabButton $active={activeTab === "review"} onClick={() => handleTabChange("review")}>리뷰</TabButton>
          <TabButton $active={activeTab === "qna"} onClick={() => handleTabChange("qna")}>문의하기</TabButton>
        </TabMenu>
        <Divider />

        {activeTab === "description" && <ProductDescription product={product} />}
        {activeTab === "size" && <ProductSizingInfo product={product} />}
        {activeTab === "review" && <ProductReviews productId={currentProductId} />}
        {activeTab === "qna" && <ProductQnAs productId={currentProductId} product={product} />}
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
  border: none;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
  white-space: nowrap;
  background: none;
  padding: 4px 2px;
  position: relative;
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0; bottom: 0;
    width: 100%; height: 1px;
    background-color: rgb(255, 255, 255);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s ease-out;
  }
  &:hover { color: rgb(255, 255, 255); }
  &:hover::after { transform: scaleX(1); }
  &.active, &.$active { color: rgb(255, 255, 255); }
  &.active::after { transform: scaleX(1); }

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
3