import { useState } from 'react';
import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import { useProductReviewsQuery } from '@/features/product-reviews';
import { ReviewItemCard } from './review-item-card';

interface ProductReviewsProps {
  productId: number;
}

function ProductReviews({ productId }: ProductReviewsProps) { 
  const [currentPage, setCurrentPage] = useState(0);
  const size = 5;

  const { data, isError, isFetching } = useProductReviewsQuery({
    productId,
    page: currentPage,
    size,
  });

  if (isError || !data || !data.reviews) {
    return <ReviewWrapper>리뷰가 존재하지 않습니다.</ReviewWrapper>;
  }

  const reviews = data.reviews.content;
  const averageRating = data.averageRating;
  const totalPages = data.reviews.totalPages;

  return (
    <ReviewWrapper>
      <ReviewHeader>
        <AverageRating>
          후기★{averageRating.toFixed(1)}({data.reviews.totalElements.toLocaleString()})
        </AverageRating>
      </ReviewHeader>
      <ReviewListContainer>
        <ReviewList>
          {reviews.length === 0 ? (
            <EmptyMessage>아직 등록된 리뷰가 없습니다.</EmptyMessage>
          ) : (
            reviews.map(review => (
              <ReviewItemCard key={review.reviewId} review={review} />
            ))
          )}
        </ReviewList>
      </ReviewListContainer>
      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton 
            key={i} 
            $isActive={i === currentPage} 
            onClick={() => setCurrentPage(i)}
            disabled={isFetching}
          >
            {i + 1}
          </PageButton>
        ))}
      </Pagination>
    </ReviewWrapper>
  );
}

const ReviewWrapper = styled.div`
  width: 100%;
  padding: 32px 0;
  color: white;
  max-width: 1200px;
  margin: 0 auto;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 16px;
`;

const ReviewListContainer = styled(GlassBox)`
  width: 100%;
  max-width: 1200px;
  padding: 0;
  margin: 0 auto;
  overflow: hidden; 
`;

const AverageRating = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const ReviewList = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #ffffff;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 24px 0 12px;
`;

const PageButton = styled.button<{ $isActive: boolean }>`
  background-color: ${({ $isActive }) => ($isActive ? 'white' : 'transparent')};
  color: ${({ $isActive }) => ($isActive ? 'black' : 'white')};
  border: 1px solid white;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export { ProductReviews };