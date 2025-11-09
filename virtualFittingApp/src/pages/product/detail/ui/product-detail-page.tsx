import { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';

import { fetchProductDetailByColor, fetchProductColors } from "@/entities/product/api/product.api";
import type { ProductDetail } from "@/entities/product";

import { BREAKPOINTS } from "@/shared";

import { ProductDetails } from "@/widgets/product-details";
import { ProductDescription } from "@/widgets/product-description";
import { ProductReviews } from "@/widgets/product-reviews";
import { ProductSizingInfo } from "@/widgets/product-sizing-info";
import { ProductQnAs } from "@/widgets/product-qnas";
import { useProductCoupon } from "@/features/coupon";

import { fetchMyUserGender } from "@/entities/user";
import { tryOnPrivateFitting } from "@/entities/virtual-fitting";
import { AddModelModal } from "@/features/virtual-try-on";
import { fetchMyRegisteredImageUrl } from "@/entities/user";
import { getAccessTokenStringFromCookie } from "@/entities/auth";

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoggedIn, userId } = useRecoilValue(authState);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [userGender, setUserGender] = useState<'M' | 'W' | null>(null);
  const [productColors, setProductColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [registeredImageUrl, setRegisteredImageUrl] = useState<string | null>(null);
  const [registeredLoading, setRegisteredLoading] = useState(false);
  const activeTab = searchParams.get("tab") || "description";
  const color = searchParams.get("color");
  const currentProductId = Number(id); 
    
  const currentUserId: string | null = userId;
  const { 
    coupons, 
    isLoading: isCouponLoading, 
    handleDownloadCoupon,
  } = useProductCoupon(currentProductId);

  const loadUserGender = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const gender = await fetchMyUserGender();
      if (gender) {
        const formattedGender = gender === 'FEMALE' ? 'W' : (gender === 'MALE' ? 'M' : null);
        setUserGender(formattedGender);
      }
    } catch (e) {
      console.error("사용자 성별 정보 로딩 실패:", e);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    loadUserGender();
  }, [loadUserGender]);

  const loadRegisteredImage = useCallback(async () => {
    setRegisteredLoading(true);
    if (!isLoggedIn || !userId) {
        setRegisteredImageUrl(null);
        setRegisteredLoading(false);
        return null;
    }

    try {
        const url = await fetchMyRegisteredImageUrl(userId); 

        if (url) {
            let ImgUrl = url.startsWith('http:') ? url.replace('http:', 'https:') : url;
            
            setRegisteredImageUrl(ImgUrl);
            return ImgUrl;
        }
        setRegisteredImageUrl(null);
        return null;

    } catch (e) {
        console.error("기존 이미지 로딩 실패:", e);
        setRegisteredImageUrl(null);
        return null;
    } finally {
        setRegisteredLoading(false);
    }
  }, [isLoggedIn, userId]);

  const openTryOn = useCallback(async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }
    setTryOnOpen(true);
    await loadRegisteredImage(); 
  }, [isLoggedIn, loadRegisteredImage, navigate]);

  const closeTryOn = useCallback(() => {
    setTryOnOpen(false);
    if (uploadPreview?.startsWith("blob:")) URL.revokeObjectURL(uploadPreview);
    setUploadPreview(null);
  }, [uploadPreview]);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file); 

    setUploadPreview(prev => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev); 
      return URL.createObjectURL(file);
    });
}, []);

  const handleTabChange = (tab: string) => {
  setSearchParams({ tab: tab, color: color || "" });
  };


  const handleConfirmUpload = useCallback(async () => {

    const accessTokenString = getAccessTokenStringFromCookie();

    if (!selectedFile || !color || !userGender || !accessTokenString) {
      alert("필수 정보가 부족합니다 (파일, 색상, 성별, 사용자 ID).");
      return; 
    }

    try {
      const params = {
        productId: currentProductId,
        color: color,
        gender: userGender,
        authUserId: accessTokenString, 
      };
      const response = await tryOnPrivateFitting(params, selectedFile);

      if (response?.data?.resultImageUrl) {
        alert("새 이미지로 가상 착용이 완료되었습니다! 결과 이미지를 확인하세요.");
      } else {
        alert("가상 착용 요청에 실패했습니다. 서버 응답 오류.");
      }
      
      closeTryOn(); 
    } catch (e) {
      console.error("가상 착용 API 호출 실패:", e);
      alert("새 이미지로 가상 착용에 실패했습니다.");
    }
  }, [selectedFile, currentProductId, color, userGender, currentUserId, closeTryOn]);

    const handleUseExisting = useCallback(() => {
    closeTryOn();
  }, [closeTryOn]);


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
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, color, navigate]);

  if (loading || !product) {
    return <div>Loading...</div>;
  }

  const finalPrice = product.productPrice;
    const productDetailsProps = {
      product,
      productColors,
      onColorChange: (newColor: string) => {
        setSearchParams({ tab: activeTab, color: newColor }); 
      },
      coupons,
      isCouponLoading,
      handleDownloadCoupon,
      finalPrice,
      onTryOn: openTryOn, 
    };

  return (
    <Wrapper>
      <ProductDetails {...productDetailsProps} />

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
  cursor: pointer;

  text-decoration: none; 
  
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: rgb(255, 255, 255);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s ease-out;
  }

  &:hover {
    color: rgb(255, 255, 255);
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &.active {
    color: rgb(255, 255, 255);
  }

  &.active::after {
    color: rgb(255, 255, 255);
  }

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