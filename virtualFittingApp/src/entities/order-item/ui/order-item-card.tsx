import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import type { CheckoutItemDetail } from '@/shared/types/checkout';

interface OrderItemCardProps {
  item: CheckoutItemDetail & { isSoldOut?: boolean };
  finalPrice?: number;
}

export const OrderItemCard = ({ item, finalPrice }: OrderItemCardProps) => {
  const navigate = useNavigate();

  const regularPrice = item.price * item.quantity;
  const preCouponPrice = (item.discountedPrice ?? item.price) * item.quantity;
  const displayPrice = finalPrice !== undefined ? finalPrice : preCouponPrice;
  const showOriginalPrice = displayPrice < regularPrice;

  const handleClick = () => {
    navigate(`/products/${item.productId}`);
  };

  return (
    <CardContainer>
      <ItemImage src={item.image} alt={item.name} onClick={handleClick} />
      <ItemInfo>
        <div>
          <Brand>{item.brand}</Brand>   
          <NameRow>
            <Name onClick={handleClick}>{item.name}</Name>
            {item.isSoldOut && <SoldOutText>품절</SoldOutText>}
          </NameRow>
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
  text-align: left;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
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

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
`;

const Name = styled.div`
  font-size: 14px;
  color: white;
  line-height: 1.4;
  cursor: pointer; /* Add cursor pointer to indicate clickability */
`;

const SoldOutText = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #ff4d4d;
  background-color: rgba(255, 77, 77, 0.1);
  padding: 1px 4px;
  border-radius: 4px;
  white-space: nowrap;
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
