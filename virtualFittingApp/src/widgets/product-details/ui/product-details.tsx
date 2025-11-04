import { useState, useEffect } from "react";
import type { ProductDetail } from "@/entities/product";
import { useProductDetails } from "../hooks/use-product-details";
import * as S from "./product-details.styled";
// import { ICON_SHARE } from "@/shared";
import { AddToCartButton } from "@/features/add-to-cart";
import { AITryOnButton } from "@/features/ai-try-on";
import { SoldOutButton } from "@/features/product-options";
import { InitiateCheckoutSingleButton } from "features/initiate-checkout-single";
import { ProductOptions } from "@/features/product-options";
import type { ClaimableCoupon } from '@/entities/coupon';
import { ProductCoupon } from "@/features/coupon";
import { ProductCouponButton } from "@/features/coupon";
import { useProductLike } from "@/features/product-like"; 
import { ProductLikeButton } from "@/features/product-like";
import { PopUpBottom } from "@/shared/ui/PopUpBottom";

type ProductDetailsProps = {
  product: ProductDetail;
  productColors: string[];
  onColorChange?: (color: string) => void;

  coupons: ClaimableCoupon[];
  isCouponLoading: boolean;
  handleDownloadCoupon: (brandCampaignId: number) => Promise<number | null>;
  finalPrice: number;
};

function ProductDetails({
  product,
  productColors,
  onColorChange,

  finalPrice,
}: ProductDetailsProps) {
  const {
    price,
    quantity,
    selectedColor,
    selectedSize,
    // finalPrice,
    sizesSorted,
    selectedProductImages,
    setQuantity,
    setSelectedSize,
    handleAddToCart,
    handlePurchaseClick,
    handleColorChange,
  } = useProductDetails(product, onColorChange);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showSoldOutPopup, setShowSoldOutPopup] = useState(false);
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const { isLiked, toggleLike, isLoading: isLikeToggling } = useProductLike(product.productId);
  const totalQuantity = product.totalQuantity;
  const isSoldOut = totalQuantity === 0

  
  useEffect(() => {
    if (showSoldOutPopup) {
        const timer = setTimeout(() => {
            setShowSoldOutPopup(false);
        }, 2200); 
        return () => clearTimeout(timer);
    }
  }, [showSoldOutPopup]);
  
  useEffect(() => {
    if (showAddToCartPopup) {
        const timer = setTimeout(() => {
            setShowAddToCartPopup(false);
        }, 2200); 
        return () => clearTimeout(timer);
    }
  }, [showAddToCartPopup]);

  const handleSoldOutAction = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowSoldOutPopup(true);
  };

  const handleAddToCartAndShowPopup = () => {
      handleAddToCart(); 
      setShowAddToCartPopup(true);
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

  if (!price) return null;

  const hasDiscount =
    price.discounted !== undefined && price.discounted < price.original;
  const discountRate = hasDiscount
    ? Math.round(((price.original - price.discounted!) / price.original) * 100)
    : 0;

  return (
    <S.ProductBox>
      <S.ImageCarouselContainer
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {selectedProductImages && selectedProductImages.length > 0 ? (
          <>
            {isHovering && selectedProductImages.length > 1 && (
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
              alt={`${product.productName} - slide ${currentIndex + 1}`}
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
      </S.ImageCarouselContainer>
      <S.ProductInfoBox>
        <S.TopRow>
          <S.Brand>{product.brandUser.firmName}</S.Brand>
        </S.TopRow>
        <S.TopRow>
          <S.ProductName>{product.productName}</S.ProductName>
          <ProductLikeButton 
            productId={product.productId} 
            isInitiallyLiked={isLiked}
            onToggle={toggleLike}
            isLoading={isLikeToggling}
          />
        </S.TopRow>
        <S.TopRow>
          {hasDiscount ? (
            <S.PriceGroup>
              <S.DiscountRate>{discountRate}%</S.DiscountRate>
              <S.DiscountPrice>
                {price.discounted!.toLocaleString()}원
              </S.DiscountPrice>
              <S.OriginalPriceBox>
                <S.OriginalPrice>
                  {price.original.toLocaleString()}원
                </S.OriginalPrice>
              </S.OriginalPriceBox>
            </S.PriceGroup>
          ) : (
            <S.Price>{price.original.toLocaleString()}원</S.Price>
          )}
          {/* <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <S.IconImage src={ICON_SHARE} alt="share icon" />
          </div> */}
          <ProductCouponButton 
            onClick={() => setShowCouponModal(true)}
          />
          <ProductCoupon
            productId={product.productId}
            finalPrice={finalPrice}
            pageType="product"
            onSelect={() => {}} 
            currentSelectedCoupon={null} 
            showPopup={showCouponModal}
            setShowPopup={setShowCouponModal}
          />
        </S.TopRow>
        <S.Description>{product.productDesc}</S.Description>
        <ProductOptions
          productMaterials={product.productMaterials}
          productColors={productColors}
          sizesSorted={sizesSorted}
          price={price}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          quantity={quantity}
          handleColorChange={handleColorChange}
          setSelectedSize={setSelectedSize}
          setQuantity={setQuantity}
        />
        <S.ButtonBox>
          {isSoldOut ? (
            <SoldOutButton onClick={handleSoldOutAction} />
          ) : (
            <>
              <AddToCartButton onClick={handleAddToCartAndShowPopup} />
              <InitiateCheckoutSingleButton onClick={handlePurchaseClick} />
            </>
          )}
        </S.ButtonBox>
        <S.ButtonBox>
          <AITryOnButton />
        </S.ButtonBox>
      </S.ProductInfoBox>

      {showSoldOutPopup && (
          <PopUpBottom message="품절된 상품입니다." />
      )}
      {showAddToCartPopup && (
          <PopUpBottom message="장바구니에 상품이 추가되었습니다." />
      )}
    </S.ProductBox>
  );
}


export { ProductDetails };
