import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import { useReviewList } from "../hooks/use-review-list";
import { ReviewListFilter } from "@/features/review-list-filter";
import { ReviewCard } from "@/entities/review";
import { ReviewableOrderCard } from "@/entities/order";
import { ReviewActions } from "@/features/review-actions/review-actions";
import { GlassBox } from "@/shared/components/glass-box";
import alertImg from "@/shared/assets/images/alert-fallback.png";

export function ReviewList() {
  const { filteredOrders, activeTab, setActiveTab, handleDeleteReview } = useReviewList();

  const emptyMsg = activeTab === "작성완료" ? "작성 완료된 리뷰가 없습니다." : "작성 가능한 리뷰가 없습니다.";

  return (
    <OuterWrapper>
      <ReviewListFilter activeTab={activeTab} onTabClick={setActiveTab} />
      <ContentWrapper>
        {(filteredOrders?.length ?? 0) === 0 ? (
          <EmptyWrapper>
            <AlertImage src={alertImg} alt="알림 아이콘" />
            <Message>{emptyMsg}</Message>
          </EmptyWrapper>
        ) : (
          <CardGrid>
            {filteredOrders.map((order) => (
              <StyledGlassCard key={`${order.id}-${order.date}`}>
                {activeTab === "작성완료" && order.reviewData ? (
                  <ReviewCard
                    order={order}
                    reviewData={order.reviewData}
                    onDelete={handleDeleteReview}
                  />
                ) : (
                  <>
                    <ReviewableOrderCard
                      order={{ orderId: order.id, item: order }}
                    />
                    <ActionsDivider />
                    <ReviewActions order={{ orderId: order.id, item: order }} />
                  </>
                )}
              </StyledGlassCard>
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
  max-width: 1000px;
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

const Message = styled.p`
  font-size: 20px;
  margin-bottom: 20px;
  color: #d9d9d9;
`;

const AlertImage = styled.img`
  width: 80px;
  height: 80px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const StyledGlassCard = styled(GlassBox)`
  width: 100%;
  padding: 16px;
  overflow: hidden;

  @media (max-width: ${BREAKPOINTS.md}px) {
    margin: 8px 0;
    padding: 14px;
  }
`;

const ActionsDivider = styled.div`
  margin: 12px 0 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.35) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0.7;
`;
