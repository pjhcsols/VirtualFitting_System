import styled from "styled-components";
import { useState, useEffect } from "react";
import { ColorPopup } from "./color-pop-up";
import { ColorSwatchesList } from "./color-swatches-list";
import { fetchProductPrice } from "@/entities/discount";
import { GlassBox } from "@/shared/components/glass-box";
import { useProductLike } from "@/features/product-like"; 
import { ProductLikeButton } from "@/features/product-like";

type ProductCardProps = {
  product: any;
  onClick?: () => void;
};

function ProductCard({ product, onClick }: ProductCardProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [price, setPrice] = useState<{ original: number; discounted: number } | null>(null);
  const maxVisibleColors = 3;
  const remainingColors = (product.productColors?.length || 0) - maxVisibleColors;
  const { isLiked, toggleLike, isLoading: isLikeToggling } = useProductLike(product.productId);

  useEffect(() => {
    async function loadPrice() {
      const priceData = await fetchProductPrice(product.productId);
      if (priceData) {
        setPrice({
          original: priceData.baseUnitPrice,
          discounted: priceData.productDiscountedUnitPrice,
        });
      }
    }
    loadPrice();
  }, [product.productId]);

  return (
    <Card onClick={onClick} borderRadius={"8px"}>
      <ImageBox $imageUrl={product.productPhotoUrls[0]}>
        <ColorSwatches>
          <ColorSwatchesList colors={product.productColors?.slice(0, maxVisibleColors) || []} />
          {remainingColors > 0 && (
            <ExtraIcon
              onClick={(e) => {
                e.stopPropagation();
                setIsPopupOpen(true);
              }}
            >
              +more
            </ExtraIcon>
          )}
        </ColorSwatches>
        {isPopupOpen && (
          <ColorPopup colors={product.productColors} onClose={() => setIsPopupOpen(false)} />
        )}
      </ImageBox>
      <InfoBox>
        <TitleRow>
          <Category>{product.categoryName}</Category>
          <ProductLikeButtonWrapper>
            <ProductLikeButton 
              productId={product.productId} 
              isInitiallyLiked={isLiked}
              onToggle={toggleLike}
              isLoading={isLikeToggling}
            />
          </ProductLikeButtonWrapper>
        </TitleRow>
        <Name>{product.productName}</Name>
        <PriceBox>
          {price && (
            <>
              {price.original !== price.discounted ? (
                <>
                  <DiscountRate>
                    {Math.round(((price.original - price.discounted) / price.original) * 100)}%
                  </DiscountRate>
                  <PriceRow>
                    <Price>{price.discounted.toLocaleString()}원</Price>
                    <OriginalPrice>{price.original.toLocaleString()}원</OriginalPrice>
                  </PriceRow>
                </>
              ) : (
                <>
                  <PriceRow>
                    <Price>{price.original.toLocaleString()}원</Price>
                  </PriceRow>
                </>
              )}
            </>
          )}
        </PriceBox>
      </InfoBox>
    </Card>
  );
  }

const Card = styled(GlassBox)`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

const ImageBox = styled.div<{ $imageUrl: string }>`
  width: 100%;
  aspect-ratio: 4 / 5;
  position: relative;
  z-index: -2;
  background-image: url(${({ $imageUrl }) => $imageUrl});
  background-size: cover;
  background-position: center;
`;

const InfoBox = styled.div`
  padding: 12px;
  aspect-ratio: 5 / 1;
`;

const Category = styled.div`
  display: flex;
  font-family: "pretendard";
  font-size: 11px;
  font-weight: 500;
  color: #eee;
  text-decoration: underline;
  cursor: pointer;
`;

const Name = styled.div`
  display: flex;
  font-size: 13px;
  color: #fff;
`;

const PriceBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 6px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DiscountRate = styled.div`
  font-size: 11px;
  background-color: #ff4d4d;
  color: white;
  font-weight: 600;
  margin-top: 2px;
  padding: 0px 2px;
  border-radius: 3px;
  align-items: center;
`;

const OriginalPrice = styled.div`
  font-size: 13px;
  color: #ccc;
  text-decoration: line-through;
  font-family: "pretendard";
`;

const Price = styled.div`
  font-size: 13px;
  color: white;
  font-family: "pretendard";
  font-weight: 600;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px; /* Name과의 간격 조정 */
`;

const ColorSwatches = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  z-index: 2;
`;

const ProductLikeButtonWrapper = styled.div`
  /* 🚨 절대 위치 제거 */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* width: 24px; // 아이콘 크기만큼만 */
  height: 24px;
  z-index: 2; /* InfoBox 내에서 클릭이 가능하도록 z-index 조정 */
`;

const ExtraIcon = styled.div`
  width: 32px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "pretendard";
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

export { ProductCard };
