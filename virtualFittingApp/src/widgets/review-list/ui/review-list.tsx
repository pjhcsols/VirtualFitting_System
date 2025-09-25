import styled from 'styled-components';
import { BREAKPOINTS } from '@/shared';
import { useReviewList } from '../hooks/use-review-list';
import { ReviewListFilter } from "@/features/review-list-filter";
import { ReviewCard } from '@/entities/review';
import { ReviewableOrderCard } from '@/entities/order';
import { ReviewActions } from '@/features/review-actions/ReviewActions';

export function ReviewList() {
  const { filteredOrders, activeTab, setActiveTab, handleDeleteReview } = useReviewList();

  return (
    <OuterWrapper>
      <ReviewListFilter activeTab={activeTab} onTabClick={setActiveTab} />
      <ContentWrapper>
        {filteredOrders.length === 0 ? (
          <EmptyWrapper>...</EmptyWrapper>
        ) : (
          <CardGrid>
            {filteredOrders.map((order) => (
              <GlassCard key={order.id}>
                {activeTab === "작성완료" && order.reviewData ? (
                  <ReviewCard
                    order={order}
                    reviewData={order.reviewData}
                    onDelete={handleDeleteReview}
                  />
                ) : (
                  <>
                    <ReviewableOrderCard order={order} />
                    <ReviewActions order={order} />
                  </>
                )}
              </GlassCard>
            ))}
          </CardGrid>
        )}
      </ContentWrapper>
    </OuterWrapper>
  );
}


const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 30px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 0 16px;
    max-width: 100%;
  }
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const GlassCard = styled.div`
  border-radius: 16px;
  padding: 16px;
  overflow: hidden;

  background: rgba(200, 200, 200, 0.15);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 10px 30px rgba(0, 0, 0, 0.15);

  @media (max-width: ${BREAKPOINTS.md}px) {
    margin: 20px auto 28px;   
    padding: 20px 14px 12px;
  }

`;