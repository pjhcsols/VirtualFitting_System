import {useState} from "react";
import styled from "styled-components";
import { OrderItem } from "@/pages/my/types/order";
import alertImg from "@/pages/my/ui/alert.png";
import { formatSimpleDate } from "@/shared";
import type { ReviewData } from "@/pages/my/types/review";
import { ELLIPSIS_ICON, STAR_FILLED_ICON } from "@/pages/my/constants";

type ReviewCardProps = {
  order: OrderItem;
  reviewData: ReviewData;
  onDelete: (id: string) => void;
};

const ReviewCard = ({ order, reviewData, onDelete }: ReviewCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    onDelete(reviewData.id);
  };
  return (
    <CardWrapper>
      <Header>
        <StatusText>스타일 후기</StatusText>

        <EllipsisButton onClick={() => setMenuOpen(!menuOpen)}>
          <EllipsisImg src={ELLIPSIS_ICON} alt="menu" />
        </EllipsisButton>

        {menuOpen && (
          <MenuBox>
            <MenuItem>수정하기</MenuItem>
            <MenuItem onClick={handleDelete}>삭제하기</MenuItem>
          </MenuBox>
        )}
      </Header>

      <RatingSection>
        {Array.from({ length: reviewData.rating }).map((_, index) => (
          <StarImg key={index} src={STAR_FILLED_ICON} alt="star" />
        ))}
        <DateText>{formatSimpleDate(reviewData.date)}</DateText>
      </RatingSection>

      <ProductInfo>
        <ProductImg src={order.productImageUrl || alertImg} />
        <Details>
          <Brand>{order.brand}</Brand>
          <ProductName>{order.productName} {order.options.color}</ProductName>
          <OptionText>{order.options.size} 구매</OptionText>
        </Details>
      </ProductInfo>

      {/* 사진 출력 */}
      {reviewData.photos?.length > 0 && (
        <PhotoWrapper>
          {reviewData.photos.map((photo, idx) => (
            <ReviewImg key={idx} src={photo} alt={`review-${idx}`} />
          ))}
        </PhotoWrapper>
      )}

      <ReviewText>{reviewData.reviewText}</ReviewText>
    </CardWrapper>
  );
};

export { ReviewCard };


const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 550px;
  align-items: flex-start;
`;

const Header = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  text-align: left;
`;

const StatusText = styled.span`
  font-weight: bold;
`;

const RatingSection = styled.div`
  font-size: 13px;
  color: #777;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StarImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 2px;
`;

const DateText = styled.span``;

const ProductInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const ProductImg = styled.img`
  width: 60px;
  height: 70px;
  background-color: #d9d9d9;
  border-radius: 10px;
  object-fit: cover;
  background-position: center;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const Brand = styled.div`
  font-weight: bold;
  font-size: 14px;
  text-align: left;
`;

const ProductName = styled.div`
  font-size: 13px;
  margin-top: 4px;
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 12px;
  color: #999;
  text-align: left;
`;

const ReviewText = styled.p`
  font-size: 14px;
  line-height: 1.4;
  width: 100%;
  text-align: left;
`;

const PhotoWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin: 8px 0;
`;

const ReviewImg = styled.img`
  width: 100px;
  height: 130px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid #eee;
`;

const EllipsisButton = styled.div`
  margin-left: auto;
  cursor: pointer;
  position: relative;
`;

const EllipsisImg = styled.img`
  width: 20px;
  height: 20px;
`;

const MenuBox = styled.div`
  position: absolute;
  top: 28px;
  right: 0;
  width: 100px;
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10;
`;

const MenuItem = styled.div`
  padding: 8px 0;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;
