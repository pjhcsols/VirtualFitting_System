import {useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { OrderItem } from "@/pages/my/types/order";
import alertImg from "@/pages/my/ui/alert.png";
import { formatSimpleDate } from "@/shared";
import type { ReviewData } from "@/pages/my/types/review";
import { ELLIPSIS_ICON, STAR_FILLED_ICON, STAR_EMPTY_ICON } from "@/pages/my/constants";

type ReviewCardProps = {
  order: OrderItem;
  reviewData: ReviewData;
  onDelete: (id: string) => void;
};

const ReviewCard = ({ order, reviewData, onDelete }: ReviewCardProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    onDelete(reviewData.id);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <CardWrapper>
      <Header>
        <StatusText>스타일 후기</StatusText>

        <EllipsisButton onClick={() => setMenuOpen(!menuOpen)}>
          <EllipsisImg src={ELLIPSIS_ICON} alt="menu" />
        </EllipsisButton>

        {menuOpen && (
          <MenuBox ref={menuRef}>
            <MenuItem onClick={() => navigate(`/myPage/review/${order.id}`, { state: { reviewData } })}>수정하기</MenuItem>
            <MenuItem onClick={handleDelete}>삭제하기</MenuItem>
          </MenuBox>
        )}
      </Header>

      <RatingSection>
        {Array.from({ length: 5 }).map((_, index) => (
          <StarImg key={index} src={index < reviewData.rating ? STAR_FILLED_ICON : STAR_EMPTY_ICON} alt="star" />
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

      <ButtonWrapper>
        <ActionButton>
          리뷰 확인
        </ActionButton>
      </ButtonWrapper>
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
  gap: 0;
`;

const StarImg = styled.img`
  width: 20px;
  height: 20px;
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
  line-height: 1;
  width: 100%;
  text-align: left;
  margin-top: 1px;
  margin-bottom: 1px;
`;

const PhotoWrapper = styled.div`
  display: flex;
  gap: 8px; 
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
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EllipsisImg = styled.img`
  width: 20px;
  height: 20px;
`;

const MenuBox = styled.div`
  position: absolute;
  top: 170px;
  margin-left: 440px;
  min-width: 100px;
  padding: 5px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10;
`;

const MenuItem = styled.div`
  padding: 8px;
  font-size: 12px;
  color: #555;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: flex-start;
`;

const ActionButton = styled.button`
    width: 540px;
    height: 40px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
    font-size: 14px;
    cursor: pointer;
`;
