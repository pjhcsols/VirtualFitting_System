import { COLOR_MAP } from "@/shared";
import type { ProductDetail } from "@/entities/product";
import { useProductDetails } from "../hooks/use-product-details";
import * as S from "./product-details.styled";
import { ICON_SHARE } from "@/shared";
import { AddToCartButton } from "@/features/add-to-cart";
import { AITryOnButton } from "@/features/ai-try-on";
import { SelectQuantity } from "@/features/select-quantiy";
import { ProductImageThumbnail } from "@/entities/product";
import { InitiateCheckoutSingleButton } from "features/initiate-checkout-single";
import {
  ProductCoupon,
  SelectedCouponDisplay,
} from "@/features/product-coupon";

type ProductDetailsProps = {
  product: ProductDetail;
  productColors: string[];
  onColorChange?: (color: string) => void;
};

function getPaymentMethodName(method: string): string {
  const methodNames: { [key: string]: string } = {
    CARD: "신용카드",
    TRANSFER: "계좌이체",
    VIRTUAL_ACCOUNT: "가상계좌",
  };
  return methodNames[method] || method;
}

function ProductDetails({
  product,
  productColors,
  onColorChange,
}: ProductDetailsProps) {
  const {
    price,
    selectedCoupon,
    quantity,
    showPaymentTab,
    paymentLoading,
    selectedColor,
    selectedSize,
    mainImage,
    finalPrice,
    sizesSorted,
    selectedProductImages,
    selectedPaymentMethod,
    setQuantity,
    setShowPaymentTab,
    setSelectedSize,
    setMainImage,
    setSelectedPaymentMethod,
    handleAddToCart,
    handlePurchaseClick,
    handleSelectCoupon,
    handlePurchase,
    handleColorChange,
  } = useProductDetails(product, onColorChange);

  if (!price) return null;

  const hasDiscount =
    price.discounted !== undefined && price.discounted < price.original;
  const discountRate = hasDiscount
    ? Math.round(((price.original - price.discounted!) / price.original) * 100)
    : 0;

  return (
    <S.ProductBox>
      <S.ProductSmallImagesContainer>
        {selectedProductImages.map((src, i) => (
          <ProductImageThumbnail
            key={i}
            imageSrc={src}
            onMouseEnter={() => setMainImage(src)}
          />
        ))}
      </S.ProductSmallImagesContainer>
      <S.ProductImage src={mainImage} alt={product.productName} />
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
              <S.DiscountPrice>
                {price.discounted!.toLocaleString()}원
              </S.DiscountPrice>
              <S.OriginalPriceBox>
                <S.OriginalPrice>
                  {price.original.toLocaleString()}원
                </S.OriginalPrice>
                <S.DiscountRate>{discountRate}%</S.DiscountRate>
              </S.OriginalPriceBox>
            </S.PriceGroup>
          ) : (
            <S.Price>{price.original.toLocaleString()}원</S.Price>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ProductCoupon productId={product.productId} />
            <S.IconImage src={ICON_SHARE} alt="share icon" />
          </div>
        </S.TopRow>
        <SelectedCouponDisplay
          coupon={selectedCoupon}
          onRemove={() => handleSelectCoupon(null)}
        />
        <S.Description>{product.productDesc}</S.Description>
        <S.ColorBoxContainer>
          <S.SelectedColorText>
            {product.productMaterials.join(", ")} | {selectedColor}
          </S.SelectedColorText>
          <S.ColorSwatches>
            {productColors.map((color) => (
              <S.ColorCircle
                key={color}
                $color={COLOR_MAP[color] ?? "transparent"}
                $selectedColor={selectedColor === color}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </S.ColorSwatches>
        </S.ColorBoxContainer>
        <S.SizeBoxContainer>
          <S.SizeBox>
            {sizesSorted.map((size) => (
              <S.SizeItem
                key={size}
                $selectedSize={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </S.SizeItem>
            ))}
          </S.SizeBox>
        </S.SizeBoxContainer>
        <S.OptionBox>
          <S.OptionTop>
            <S.OptionText>
              {selectedColor} · {selectedSize}
            </S.OptionText>
          </S.OptionTop>
          <SelectQuantity
            unitPrice={price.original}
            discountedPrice={price.discounted}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </S.OptionBox>
        <S.ButtonBox>
          <AddToCartButton onClick={handleAddToCart} />
          <InitiateCheckoutSingleButton onClick={handlePurchaseClick} />
        </S.ButtonBox>
        {showPaymentTab && (
          <S.TabOverlay onClick={() => setShowPaymentTab(false)}>
            <S.TabContent onClick={(e) => e.stopPropagation()}>
              <h3>결제 수단 선택</h3>
              <S.PaymentMethodContainer>
                {["CARD", "TRANSFER", "VIRTUAL_ACCOUNT"].map((method) => (
                  <S.PaymentMethodButton
                    key={method}
                    $selected={selectedPaymentMethod === method}
                    onClick={() =>
                      setSelectedPaymentMethod(
                        method as "CARD" | "TRANSFER" | "VIRTUAL_ACCOUNT",
                      )
                    }
                  >
                    {getPaymentMethodName(method)}
                  </S.PaymentMethodButton>
                ))}
              </S.PaymentMethodContainer>

              <S.PaymentInfo>
                <div>상품명 : {product.productName}</div>
                <div>총 결제금액 : {finalPrice.toLocaleString()}원</div>
                <div>
                  결제방법 : {getPaymentMethodName(selectedPaymentMethod)}
                </div>
              </S.PaymentInfo>

              <S.PaymentButton
                onClick={handlePurchase}
                disabled={paymentLoading}
              >
                {paymentLoading
                  ? "결제 진행 중..."
                  : `${finalPrice.toLocaleString()}원 결제하기`}
              </S.PaymentButton>
            </S.TabContent>
          </S.TabOverlay>
        )}
        <S.ButtonBox>
          <AITryOnButton />
        </S.ButtonBox>
      </S.ProductInfoBox>
    </S.ProductBox>
  );
}

export { ProductDetails };
