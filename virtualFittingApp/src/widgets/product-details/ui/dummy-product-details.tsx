import styled, { keyframes} from "styled-components";
import { useState, useEffect } from "react";
import type { ProductDetail } from "@/entities/product";
import { useProductDetails } from "../hooks/use-product-details";
import * as S from "./product-details.styled";
import { VirtualTryOnButton } from "@/features/virtual-try-on";
import { ProductOptions } from "@/features/product-options";
import { GlassButton } from "@/shared/components/glass-button";
import { ProductLikeButton } from "@/features/product-like";
import CircularProgress from '@mui/material/CircularProgress';
import { PopUpBottom } from "@/shared/ui/PopUpBottom";
import { BREAKPOINTS } from "@/shared";

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-2px);
  }
`;

const AnimatedButtonContainer = styled.div`
  animation: ${bounce} 1.5s infinite;
  display: inline-block;
  width: 100%;
`;

type ProductWithQuantity = ProductDetail & { totalQuantity: number };

type ProductDetailsProps = {
  product: ProductWithQuantity;
  onTryOn?: () => void; 
  fittingResultUrl: string | null;
  fittingDelay: number | null;
  onViewResult: () => void;
  isProcessing: boolean;
  onColorChange?: (color: string) => void;
};

function DummyProductDetails({
  product,
  onTryOn,
  fittingResultUrl,
  fittingDelay,
  onViewResult,
  isProcessing,
  onColorChange,
}: ProductDetailsProps) {

  const dummyPrice = {
    original: 82000,
    discounted: 77900,
  };

  const {
    selectedProductImages, 
    selectedColor, handleColorChange: handleColorChangeInternal,
    quantity, setQuantity,
  } = useProductDetails(product, dummyPrice, onColorChange);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSoldOutPopup, setShowSoldOutPopup] = useState(false);
  const POPUP_DURATION = 2200;
  const isMobile = typeof window !== "undefined" && window.innerWidth < BREAKPOINTS.md;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const price = {
    original: 50350
  };

  const handleClick = () => {
  };

  const isSoldOut = false;

  const handleTryOnClick = () => {
    if (onTryOn) {
      onTryOn();
    }
  };
  
  const handleDummyActionAndShowPopup = () => {
      setShowSoldOutPopup(true);
  };

  useEffect(() => {
    if (showSoldOutPopup) {
      const timer = setTimeout(() => {
        setShowSoldOutPopup(false);
      }, POPUP_DURATION); 
      return () => clearTimeout(timer);
    }
  }, [showSoldOutPopup]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedProductImages]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? selectedProductImages.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === selectedProductImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const handleToggleDummy = () => {
    return Promise.resolve();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (!price) return null;

  return (
    <S.ProductBox>
      <S.ImageCarouselContainer
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {isProcessing ? (
          <S.FittingButton disabled>
            <CircularProgress size={20} style={{ color: '#fff', marginRight: '8px' }} />
            <S.LoadingText>AI 이미지 생성 중...</S.LoadingText>
          </S.FittingButton>
        ) : (
          fittingResultUrl && (
            <S.FittingResultButton onClick={onViewResult}>
              가상 착용 결과 확인 ({fittingDelay ?? '--'}ms)
            </S.FittingResultButton>
          )
        )}
        <S.ImageWrapper>
        {selectedProductImages && selectedProductImages.length > 0 ? (
          <>
            {selectedProductImages.length > 1 && (
              <>
                <S.CarouselButton onClick={goToPrevious} style={{ left: 10 }}>
                  &#10094;
                </S.CarouselButton>
                <S.CarouselButton onClick={goToNext} style={{ right: 10 }}>
                  &#10095;
                </S.CarouselButton>
              </>
            )}
            <S.ProductImage
              src={selectedProductImages[currentIndex]}
            />
            <S.Pagination>
              {selectedProductImages.map((_, slideIndex) => (
                <S.Dot
                  key={slideIndex}
                  $isActive={currentIndex === slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                />
              ))}
            </S.Pagination>
          </>
        ) : (
          <S.ProductImage src="" alt="No Image Available" />
        )}
        </S.ImageWrapper>
      </S.ImageCarouselContainer>
      <S.ProductInfoBox>
        <S.TopRow>
          <S.Brand>BASILIUM</S.Brand>
        </S.TopRow>
        <S.TopRow>
          <S.ProductName>Crown Silver T-shirts</S.ProductName>
          <ProductLikeButton 
            productId={2} 
            isInitiallyLiked={true}
            onToggle={handleToggleDummy}
            isLoading={false}
          />
        </S.TopRow>
        <S.TopRow>
          <S.PriceGroup>
              <S.DiscountRate>5%</S.DiscountRate>
              <S.DiscountPrice>
                50,350원
              </S.DiscountPrice>
              <S.OriginalPriceBox>
                <S.OriginalPrice>
                  53,000원
                </S.OriginalPrice>
              </S.OriginalPriceBox>
            </S.PriceGroup>
        </S.TopRow>
        <S.Description>오버핏 티셔츠</S.Description>
        <ProductOptions
          productMaterials={["COTTON", "POLYSTER"]}
          productColors={["BLACK", "WHITE"]}
          sizesSorted={["S"]}
          price={price}
          selectedColor={selectedColor}
          selectedSize="S"
          quantity={quantity}
          handleColorChange={handleColorChangeInternal}
          setSelectedSize={handleClick}
          setQuantity={setQuantity}
          disabled={isSoldOut}
        />
        <S.ButtonBox>
          <GlassButton onClick={handleDummyActionAndShowPopup} width="200px">ADD TO CART</GlassButton>
          <GlassButton onClick={handleDummyActionAndShowPopup} width="200px">BUY NOW</GlassButton>
        </S.ButtonBox>
        <S.ButtonBox>
          <AnimatedButtonContainer>
            <VirtualTryOnButton onClick={handleTryOnClick} disabled={isProcessing}/>
          </AnimatedButtonContainer>
        </S.ButtonBox>
      </S.ProductInfoBox>
      {showSoldOutPopup && (
          <PopUpBottom message="품절된 상품입니다." />
      )}
    </S.ProductBox>
  );
}

export { DummyProductDetails };

