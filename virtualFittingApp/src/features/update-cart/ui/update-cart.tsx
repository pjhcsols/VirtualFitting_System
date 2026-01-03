import styled from "styled-components";
import { useState, useMemo } from "react";
import { getAccessTokenStringFromCookie } from "@/entities/auth";
import { Portal } from "@/shared/ui/Portal";
import { GlassButton } from '@/shared/components/glass-button';
import { GlassBox } from "@/shared/components/glass-box";
import { ProductOptions } from "@/features/product-options";
import { SIZE_ORDER } from "@/shared";
import type { ProductDetail } from "@/entities/product/model/types";
import { useUpdateCartItem, type UpdateCartItemRequest } from '@/entities/cart';

interface UpdateCartItemOptionsPopupProps {
  productDetail: ProductDetail;
  cartItemId: number;
  initialColor: string;
  initialSize: string;
  initialQuantity: number;
  initialOriginalPrice: number;
  initialDiscountedPrice?: number | null;
  onClose: () => void;
  onUpdateSuccess?: () => void;
}

export const UpdateCartItemOptionsPopup = ({
  productDetail,
  cartItemId,
  initialColor,
  initialSize,
  initialQuantity,
  initialOriginalPrice,
  initialDiscountedPrice,
  onClose,
  onUpdateSuccess
}: UpdateCartItemOptionsPopupProps) => {
  const accessToken = getAccessTokenStringFromCookie();

  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedSize, setSelectedSize] = useState(initialSize);

  const currentPrice = { 
    original: initialOriginalPrice,
    discounted: initialDiscountedPrice ?? initialOriginalPrice,
  };

  const hasDiscount = currentPrice.discounted < currentPrice.original;
  const discountRate = hasDiscount
    ? Math.round(((currentPrice.original - currentPrice.discounted) / currentPrice.original) * 100)
    : 0;

  const mainImageUrl = useMemo(() => {
    return productDetail.productImages.productPhotoUrls[0] || '';
  }, [productDetail.productImages]);

  const allProductColors = Array.from(new Set(
    productDetail.productOptions.map(opt => opt.productColor)
  ));

  const sizesSorted = useMemo(() => productDetail.productOptions
    .filter(po => po.productColor === selectedColor)
    .map(po => po.productSize)
    .sort((a, b) => (SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))), 
    [productDetail.productOptions, selectedColor]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const newSize = productDetail.productOptions.find(opt => opt.productColor === color)?.productSize;
    if (newSize) {
      setSelectedSize(newSize);
    }
  };

  const { mutate: updateItem } = useUpdateCartItem();

  const handleApply = () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    const updateData: UpdateCartItemRequest = {
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
    };

    updateItem(
      { accessToken: accessToken, itemId: cartItemId, updateData },
      {
        onSuccess: () => {
          onUpdateSuccess?.(); 
          onClose(); 
        },
        onError: () => {
          alert("옵션 변경에 실패했습니다. 다시 시도해주세요.");
        }
      }
    );
  };

  return (
    <Portal>
      <PopupOverlay onClick={onClose}>
        <PopupContent onClick={(e) => e.stopPropagation()}>
          <PopupHeader>
            <Title>옵션 변경</Title>
            <CloseButton onClick={onClose}>×</CloseButton>
          </PopupHeader>
          <ContentWrapper>
            <ImageSection>
                <ProductImage src={mainImageUrl} alt={`${productDetail.productName} image`} />
            </ImageSection>
            <OptionsWrapper>
              <ProductInfoBox>
                <TopRow>
                  <Brand>{productDetail.brandUser.firmName}</Brand>
                </TopRow>
                <TopRow>
                  <ProductName>{productDetail.productName}</ProductName>
                </TopRow>
                <TopRow>
                  {hasDiscount ? (
                      <PriceGroup>
                          <DiscountRate>{discountRate}%</DiscountRate>
                          <DiscountPrice>
                              {currentPrice.discounted.toLocaleString()}원
                          </DiscountPrice>
                          <OriginalPriceBox>
                              <OriginalPrice>
                                  {currentPrice.original.toLocaleString()}원
                              </OriginalPrice>
                          </OriginalPriceBox>
                      </PriceGroup>
                  ) : (
                      <Price>{currentPrice.original.toLocaleString()}원</Price>
                  )}
              </TopRow>
              </ProductInfoBox>
              <OptionsContainer>
                <ProductOptions 
                  productMaterials={productDetail.productMaterials}
                  productColors={allProductColors}
                  sizesSorted={sizesSorted}
                  price={currentPrice}
                  
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  quantity={quantity}
                  
                  handleColorChange={handleColorChange}
                  setSelectedSize={setSelectedSize}
                  setQuantity={setQuantity}
                />
              </OptionsContainer>
              <ApplyButton onClick={handleApply}>
                적용하기
              </ApplyButton>
            </OptionsWrapper>
          </ContentWrapper>
        </PopupContent>
      </PopupOverlay>
    </Portal>
  );
};

const OptionsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 1.5rem;
`;

const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: #292e49d0;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 16px;
`;

const PopupContent = styled(GlassBox)`
  width: 100%;
  max-width: 760px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); 
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
`;

const ImageSection = styled.div`
  flex: 0 0 40%;
  padding: 1rem 0 1rem 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const OptionsWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding-bottom: 1rem;
`;

const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1.25;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const ProductInfoBox = styled.div`
  padding: 1rem 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Brand = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
`;

const ProductName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DiscountRate = styled.span`
  font-size: 12px;
  background-color: #ff4d4d;
  color: white;
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 3px;
`;

const DiscountPrice = styled.span`
  font-size: 22px;
  color: #fff;
  font-weight: 600;
`;

const Price = styled.span`
  font-size: 22px;
  color: #fff;
  font-weight: 600;
`;

const OriginalPriceBox = styled.div`
  display: flex;
  align-items: center;
`;

const OriginalPrice = styled.span`
  font-size: 13px;
  color: #888;
  text-decoration: line-through;
  font-weight: 400;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #fff; }
`;

const ApplyButton = styled(GlassButton)`
  width: calc(100% - 2rem);
  margin: 1rem;
  flex-shrink: 0;
`;