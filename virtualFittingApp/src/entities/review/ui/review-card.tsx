import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatSimpleDate } from '@/shared/lib/date.util';
import type { ReviewData } from '../model/types';
import type { OrderItemWithReview } from '@/entities/order';
import icon_ellipsis from "@/shared/assets/icons/icon-ellipsis.svg";
import icon_star_filled from "@/shared/assets/icons/icon-star-filled.svg";
import icon_star_unfilled from "@/shared/assets/icons/icon-star-filled.svg";


type ReviewCardProps = {
  order: OrderItemWithReview;
  reviewData: ReviewData;
  onDelete: (id: string) => void;
};

export const ReviewCard = ({ order, reviewData, onDelete }: ReviewCardProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    if (window.confirm("리뷰를 정말로 삭제하시겠습니까?")) {
      onDelete(reviewData.id);
      setMenuOpen(false);
    }
  };

  const handleEdit = () => {
    navigate(`/mypage/review/${order.id}`, { state: { reviewData } });
  };

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <CardWrapper>
      <Header>
        <StatusText>스타일 후기</StatusText>

        <EllipsisButton onClick={() => setMenuOpen(!menuOpen)}>
          <EllipsisImg src={icon_ellipsis} alt="menu" />
          {menuOpen && (
            <MenuBox ref={menuRef}>
              <MenuItem onClick={handleEdit}>수정하기</MenuItem>
              <MenuItem onClick={handleDelete}>삭제하기</MenuItem>
            </MenuBox>
          )}
        </EllipsisButton>
      </Header>

      <RatingSection>
        {Array.from({ length: 5 }).map((_, index) => (
          <StarImg key={index} src={index < reviewData.rating ? icon_star_filled : icon_star_unfilled} alt="star" />
        ))}
        <DateText>{formatSimpleDate(reviewData.date)}</DateText>
      </RatingSection>

      <ProductInfo>
        <ProductImg src={order.productImageUrl} />
        <Details>
          <Brand>{order.brand}</Brand>
          <ProductName>{order.productName} {order.options.color}</ProductName>
          <OptionText>{order.options.size} 구매</OptionText>
        </Details>
      </ProductInfo>

      {reviewData.photos && reviewData.photos.length > 0 && (
        <PhotoWrapper>
          {reviewData.photos.map((photo, idx) => (
            <ReviewImg key={idx} src={photo} alt={`review photo ${idx + 1}`} />
          ))}
        </PhotoWrapper>
      )}

      <ReviewText>{reviewData.reviewText}</ReviewText>
    </CardWrapper>
  );
};




export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  align-items: flex-start;

  @media (max-width: ${BREAKPOINTS.md}px) {
    width: 100%;
  }
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const StatusText = styled.span`
  font-weight: bold;
  font-family: "Prata-Regular";
  color: #fff;
`;

export const RatingSection = styled.div`
  font-size: 13px;
  color: #ccc;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const StarImg = styled.img`
  width: 20px;
  height: 20px;
`;

export const DateText = styled.span`
  margin-left: 8px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.7);
`;

export const ProductInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
`;

export const ProductImg = styled.img`
  width: 60px;
  height: 70px;
  background-color: #d9d9d9;
  border-radius: 10px;
  object-fit: cover;
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
`;

export const Brand = styled.div`
  font-weight: bold;
  font-size: 14px;
  font-family: "Prata-Regular";
  color: #fff;
`;

export const ProductName = styled.div`
  font-size: 13px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.9);
`;

export const OptionText = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.6);
`;

export const ReviewText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  width: 100%;
  text-align: left;
  margin: 8px 0;
  font-family: "Prata-Regular";
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-wrap;
`;

export const PhotoWrapper = styled.div`
  display: flex;
  gap: 8px; 
  flex-wrap: wrap;
`;

export const ReviewImg = styled.img`
  width: 100px;
  height: 130px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const EllipsisButton = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EllipsisImg = styled.img`
  width: 20px;
  height: 20px;
`;

export const MenuBox = styled.div`
  position: absolute;
  top: 36px;
  right: 0;
  min-width: 100px;
  padding: 5px;
  background: rgba(200,200,200,0.12);
  border: none;
  border-radius: 6px;
  z-index: 10;
`;

export const MenuItem = styled.div`
  padding: 8px 10px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  transition: background .2s ease, color .2s ease;

  &:hover {
    background-color: rgba(255,255,255,0.08);
  }
`;
