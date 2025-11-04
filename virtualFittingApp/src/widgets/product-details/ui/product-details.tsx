import { useState, useEffect } from "react";
import type { ProductDetail } from "@/entities/product";
import { useProductDetails } from "../hooks/use-product-details";
import * as S from "./product-details.styled";
import { ICON_SHARE } from "@/shared";
import { AddToCartButton } from "@/features/add-to-cart";
import { AITryOnButton } from "@/features/ai-try-on";
import { InitiateCheckoutSingleButton } from "features/initiate-checkout-single";
import { ProductOptions } from "@/features/product-options";

type ProductDetailsProps = {
  product: ProductDetail;
  productColors: string[];
  onColorChange?: (color: string) => void;
  onTryOn?: () => void;
};

function ProductDetails({
  product,
  productColors,
  onColorChange,
  onTryOn,
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <S.IconImage src={ICON_SHARE} alt="share icon" />
          </div>
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
          <AddToCartButton onClick={handleAddToCart} />
          <InitiateCheckoutSingleButton onClick={handlePurchaseClick} />
        </S.ButtonBox>
        <S.ButtonBox>
          <AITryOnButton onClick={onTryOn} />
        </S.ButtonBox>
      </S.ProductInfoBox>
    </S.ProductBox>
  );
}

export { ProductDetails };
