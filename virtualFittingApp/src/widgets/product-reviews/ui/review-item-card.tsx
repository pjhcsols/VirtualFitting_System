import styled from 'styled-components';
import { BREAKPOINTS } from '@/shared';
import type { ReviewItem } from '@/entities/review';

interface ReviewItemCardProps {
  review: ReviewItem;
}

function renderStars(rating: number) {
  const star = "★";
  const empty = "☆";
  const maxStars = 5;
  const roundedRating = Math.round(rating);
  return star.repeat(roundedRating) + empty.repeat(maxStars - roundedRating);
}

const ensureFullUrl = (url: string): string => {
  if (!url) return '';
  if (!url.startsWith('http')) {
    return `http://${url}`; 
  }
  //[seah] 이거 고쳐주라고 부탁해야됨 ㅜ
  return url;
};

export function ReviewItemCard({ review }: ReviewItemCardProps) {
  return (
    <ItemWrapper>
      <ContentWrapper>
        <ReviewContentArea>
      <ReviewMeta>
        <ReviewRating>
          {renderStars(review.rating)}
        </ReviewRating>
        <span>{review.maskedUserId}</span>
        <ReviewDate>{new Date(review.createdAt).toLocaleDateString()}</ReviewDate>
      </ReviewMeta>
      <ReviewOptions>
          <OptionLabel>구매옵션</OptionLabel>
          {review.purchaseSize} · {review.purchaseColor}
      </ReviewOptions>
      <ReviewText>
        <ReviewTitle>{review.title}</ReviewTitle>
        {review.comment}
      </ReviewText>
      </ReviewContentArea>
        <ImageContainer>
          {review.imageUrls?.[0] && (
            <ReviewImage
              src={ensureFullUrl(review.imageUrls[0])}
            />
          )}
        </ImageContainer>
      </ContentWrapper>
    </ItemWrapper>
  );
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
`;

const ReviewContentArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const ReviewText = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #ffffffff;
  margin-bottom: 10px;
  display: flex; 
  justify-content: start;
  align-items: center;
`;

const ReviewTitle = styled.span`
  font-weight: 700;
  color: white;
  margin-right: 4px;
  display: inline;
`;

const ImageContainer = styled.div`
  width: 100px; 
  height: 100px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: ${BREAKPOINTS.md}px) { 
     display: none; 
  }
`;

const ReviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`;

const ItemWrapper = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #ccc;
  margin-bottom: 8px;

  span:nth-child(2) {
    font-weight: 600;
    color: white;
  }
`;

const ReviewRating = styled.span`
  font-size: 14px;
  color: #ffffff;
`;

const OptionLabel = styled.span`
  margin-right: 10px;
  font-weight: 600;
`;

const ReviewOptions = styled.div`
  font-size: 12px;
  width: 140px;
  height: 32px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  display: flex; 
  justify-content: start;
  align-items: center;
  padding: 0 8px; 
  white-space: nowrap;
`;

const ReviewDate = styled.span`
  font-size: 12px;
  color: #ffffff;
`;
