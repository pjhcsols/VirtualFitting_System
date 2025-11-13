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
`;

type ProductWithQuantity = ProductDetail & { totalQuantity: number };

type ProductDetailsProps = {
  product: ProductWithQuantity;
  onTryOn?: () => void; 
  fittingResultUrl: string | null;
  fittingDelay: number | null;
  onViewResult: () => void;
  isProcessing: boolean;
};

function DummyProductDetails({
  product,
  onTryOn,
  fittingResultUrl,
  fittingDelay,
  onViewResult,
  isProcessing,
}: ProductDetailsProps) {

  const dummyPrice = {
    original: 82000,
    discounted: 77900,
  };

  const {
    selectedProductImages,
  } = useProductDetails(product, dummyPrice);

  const [currentIndex, setCurrentIndex] = useState(0);

  const price = {
    original: 81700
  };
  const quantity = 1;
  const isSoldOut = false;

  const handleTryOnClick = () => {
    if (onTryOn) {
      onTryOn();
    }
  };

  const handleClick = () => {
    };
  
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

  if (!price) return null;

  return (
    <S.ProductBox>
      <S.ImageCarouselContainer>
        {isProcessing ? (
          <S.FittingButton disabled>
            <CircularProgress size={20} style={{ color: '#fff', marginRight: '8px' }} />
            <S.LoadingText>AI 이미지 생성 중...</S.LoadingText>
          </S.FittingButton>
        ) : (
          fittingResultUrl && (
            <S.FittingButton onClick={onViewResult}>
              가상 착용 결과 확인 ({fittingDelay ?? '--'}ms)
            </S.FittingButton>
          )
        )}
        <S.ImageWrapper>
        {/* {isProcessing && (
          <S.LoadingOverlay>
            <CircularProgress size={30} style={{ color: '#fff' }} />
            <S.LoadingText>AI 이미지 생성 중...</S.LoadingText>
          </S.LoadingOverlay>
        )} */}
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
          <S.ProductName>로고 오버핏 후드티</S.ProductName>
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
                77,900원
              </S.DiscountPrice>
              <S.OriginalPriceBox>
                <S.OriginalPrice>
                  82,000원
                </S.OriginalPrice>
              </S.OriginalPriceBox>
            </S.PriceGroup>
        </S.TopRow>
        <S.Description>오버핏 티셔츠</S.Description>
        <ProductOptions
          productMaterials={["COTTON", "POLYSTER"]}
          productColors={["BLACK"]}
          sizesSorted={["S", "M"]}
          price={price}
          selectedColor="BLACK"
          selectedSize="S"
          quantity={quantity}
          handleColorChange={handleClick}
          setSelectedSize={handleClick}
          setQuantity={handleClick}
          disabled={isSoldOut}
        />
        <S.ButtonBox>
          <GlassButton onClick={handleClick} width="200px">ADD TO CART</GlassButton>
          <GlassButton onClick={handleClick} width="200px">BUY NOW</GlassButton>
        </S.ButtonBox>
        <S.ButtonBox>
          <AnimatedButtonContainer>
            <VirtualTryOnButton onClick={handleTryOnClick} />
          </AnimatedButtonContainer>
        </S.ButtonBox>
      </S.ProductInfoBox>
    </S.ProductBox>
  );
}

export { DummyProductDetails };

