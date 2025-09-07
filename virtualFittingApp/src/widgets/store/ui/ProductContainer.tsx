import { type ProductDetail, COLOR_MAP } from "@/shared";
import { useProductContainer } from "../hooks/useProductContainer";
import * as S from "./ProductContainer.styles";
import { ProductSmallCard, AddButton, AIButton, PurchaseButton, QuantityBox, ICON_SHARE } from "@/shared";

type ProductContainerProps = {
  product: ProductDetail;
  productColors: string[];
  onColorChange?: (color: string) => void;
};

function getPaymentMethodName(method: string): string {
  const methodNames: { [key: string]: string } = {
    'CARD': '신용카드',
    'TRANSFER': '계좌이체',
    'VIRTUAL_ACCOUNT': '가상계좌',
  };
  return methodNames[method] || method;
}

function ProductContainer({ product, productColors, onColorChange }: ProductContainerProps) {
  const {
    price,
    coupons,
    selectedCoupon,
    quantity,
    showCouponPopup,
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
    setShowCouponPopup,
    setShowPaymentTab,
    setSelectedSize,
    setMainImage,
    setSelectedPaymentMethod,
    handleAddToCart,
    handlePurchaseClick,
    handleDownloadCoupon,
    handleSelectCoupon,
    handlePurchase,
    handleColorChange,
  } = useProductContainer(product, onColorChange);

  if (!price) return null;

  const hasDiscount = price.discounted !== undefined && price.discounted < price.original;
  const discountRate = hasDiscount ? Math.round(((price.original - price.discounted!) / price.original) * 100) : 0;

  return (
    <S.ProductBox>
      <S.ProductSmallImagesContainer>
        {selectedProductImages.map((src, i) => (
          <ProductSmallCard
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
              <S.DiscountPrice>{price.discounted!.toLocaleString()}원</S.DiscountPrice>
              <S.OriginalPriceBox>
                <S.OriginalPrice>{price.original.toLocaleString()}원</S.OriginalPrice>
                <S.DiscountRate>{discountRate}%</S.DiscountRate>
              </S.OriginalPriceBox>
            </S.PriceGroup>
          ) : (
            <S.Price>{price.original.toLocaleString()}원</S.Price>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {coupons.length > 0 && (
              <S.CouponButton onClick={() => setShowCouponPopup(true)}>
                쿠폰받기
              </S.CouponButton>
            )}
            <S.IconImage src={ICON_SHARE} alt="share icon" />
          </div>
        </S.TopRow>
        {showCouponPopup && (
          <S.CouponPopupOverlay onClick={() => setShowCouponPopup(false)}>
            <S.CouponPopupContent onClick={(e) => e.stopPropagation()}>
              <S.CloseButton onClick={() => setShowCouponPopup(false)}>×</S.CloseButton>
              <S.CouponItems>
                {coupons.map(coupon => (
                  <S.CouponItem key={coupon.campaignId} disabled={!coupon.hasAvailable}>
                    <div>{coupon.scope} 쿠폰</div>
                    <div>{coupon.percent}% / 최대 {coupon.maxDiscountPrice.toLocaleString()}원</div>
                    <div>최소 주문 {coupon.minOrderPrice.toLocaleString()}원 이상</div>
                    {coupon.hasAvailable ? (
                      <S.UseButton onClick={() => handleDownloadCoupon(coupon.campaignId)}>
                        발급하기
                      </S.UseButton>
                    ) : (
                      <S.DisabledText>조건 미달</S.DisabledText>
                    )}
                  </S.CouponItem>
                ))}
              </S.CouponItems>
            </S.CouponPopupContent>
          </S.CouponPopupOverlay>
        )}
        <S.Description>{product.productDesc}</S.Description>
        <S.ColorBoxContainer>
          <S.SelectedColorText>
            {product.productMaterials.join(", ")} | {selectedColor}
          </S.SelectedColorText>
          <S.ColorSwatches>
            {productColors.map(color => (
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
            {sizesSorted.map(size => (
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
          <QuantityBox
            unitPrice={price.original}
            discountedPrice={price.discounted}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </S.OptionBox>

        {selectedCoupon && (
          <S.CouponDisplayBox>
            <S.CouponInfo>
              <S.CouponLabel>쿠폰 적용</S.CouponLabel>
              <S.CouponDetails>
                {selectedCoupon.scope} 쿠폰 ({selectedCoupon.percent}%)
              </S.CouponDetails>
            </S.CouponInfo>
            <S.CouponRemoveButton onClick={() => handleSelectCoupon(null)}>
              ×
            </S.CouponRemoveButton>
          </S.CouponDisplayBox>
        )}
        <S.ButtonBox>
          <AddButton onClick={handleAddToCart} />
          <PurchaseButton onClick={handlePurchaseClick} />
        </S.ButtonBox>
        {showPaymentTab && (
          <S.TabOverlay onClick={() => setShowPaymentTab(false)}>
            <S.TabContent onClick={e => e.stopPropagation()}>
              <h3>결제 수단 선택</h3>
              <S.PaymentMethodContainer>
                  {['CARD', 'TRANSFER', 'VIRTUAL_ACCOUNT'].map(method => (
                      <S.PaymentMethodButton
                          key={method}
                          $selected={selectedPaymentMethod === method}
                          onClick={() => setSelectedPaymentMethod(method as 'CARD' | 'TRANSFER' | 'VIRTUAL_ACCOUNT')}
                      >
                          {getPaymentMethodName(method)}
                      </S.PaymentMethodButton>
                  ))}
              </S.PaymentMethodContainer>

              <S.PaymentInfo>
                <div>상품명 : {product.productName}</div>
                <div>총 결제금액 : {finalPrice.toLocaleString()}원</div>
                <div>결제방법 : {getPaymentMethodName(selectedPaymentMethod)}</div>
              </S.PaymentInfo>

              <S.PaymentButton
                onClick={handlePurchase}
                disabled={paymentLoading}
              >
                {paymentLoading ? '결제 진행 중...' : `${finalPrice.toLocaleString()}원 결제하기`}
              </S.PaymentButton>
            </S.TabContent>
          </S.TabOverlay>
        )}
        <S.ButtonBox>
          <AIButton />
        </S.ButtonBox>
      </S.ProductInfoBox>
    </S.ProductBox>
  );
}

export { ProductContainer };