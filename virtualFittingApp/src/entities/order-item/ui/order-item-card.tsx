import styled from 'styled-components';
import type { CheckoutItemDetail } from '@/shared/types/checkout';

interface OrderItemCardProps {
  item: CheckoutItemDetail;
  finalPrice?: number;
}

export const OrderItemCard = ({ item, finalPrice }: OrderItemCardProps) => {
  const regularPrice = item.price * item.quantity;
  const preCouponPrice = (item.discountedPrice ?? item.price) * item.quantity;
  const displayPrice = finalPrice !== undefined ? finalPrice : preCouponPrice;
  const showOriginalPrice = displayPrice < regularPrice;

  return (
    <CardContainer>
      <ItemImage src={item.image} alt={item.name} />
      <ItemInfo>
        <div>
          <Brand>{item.brand}</Brand>   
          <Name>{item.name}</Name>
          <Option>
            {item.color} · {item.size} / {item.quantity}개
          </Option>
        </div>
        <PriceContainer>
          {showOriginalPrice && (
            <OriginalPrice>{regularPrice.toLocaleString()}원</OriginalPrice>
          )}
          <Price>{displayPrice.toLocaleString()}원</Price>
        </PriceContainer>
      </ItemInfo>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px;
  text-align: left;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Brand = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: white;
`;

const Name = styled.div`
  font-size: 14px;
  color: white;
  margin: 4px 0;
  line-height: 1.4;
`;

const Option = styled.div`
  font-size: 13px;
  color: #bbbbbb;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

const Price = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: white;
`;

const OriginalPrice = styled.div`
  font-size: 13px;
  color: #bbbbbb;
  text-decoration: line-through;
  font-weight: 400;
`;

