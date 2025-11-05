import { useEffect, useState } from "react";
import styled from 'styled-components';
import { BREAKPOINTS } from '@/shared';
import { useReviewList } from '../hooks/use-review-list';
import { ReviewListFilter } from "@/features/review-list-filter";
import { ReviewCard } from '@/entities/review';
import { ReviewableOrderCard } from '@/entities/order';
import { ReviewActions } from '@/features/review-actions/review-actions';
import { GlassBox } from '@/shared/components/glass-box';
import alertImg from "@/shared/assets/images/alert-fallback.png";
import type { ReviewOrderPayload } from "@/entities/order"

const STORAGE_KEY = "reviewpayload";
const TTL_MS = 1000 * 60 * 30;

function readReviewPayload(): ReviewOrderPayload | null {
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);

    // (선택) 만료 체크
    if (parsed.__ts && Date.now() - parsed.__ts > TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

     if (!parsed.orderId || !parsed.item) return null;

    const normalizedItem = {
      ...parsed.item,
      ...(parsed.item?.date
        ? { date: new Date(parsed.item.date).toISOString() }
        : {}),
    };

    return {
      orderId: String(parsed.orderId),
      item: normalizedItem,
      ...(parsed.deadline ? { deadline: String(parsed.deadline) } : {}),
    };
  } catch {
    return null;
  }
}


export function ReviewList() {
  const { filteredOrders, activeTab, setActiveTab, handleDeleteReview } = useReviewList();
  const [injected, setInjected] = useState<ReviewOrderPayload | null>(null);

  useEffect(() => {
    const data = readReviewPayload();
    if (data) {
      setInjected(data);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return (
    <OuterWrapper>
      <ReviewListFilter activeTab={activeTab} onTabClick={setActiveTab} />
      <ContentWrapper>
        {/* 세션에서 넘어온 단건이 있으면 최상단에 먼저 보여주기 */}
        {injected && (
          <CardGrid style={{ marginBottom: 16 }}>
            <StyledGlassCard>
              <ReviewableOrderCard order={injected} />
              <ActionsDivider />
              <ReviewActions order={injected} />
            </StyledGlassCard>
          </CardGrid>
        )}

        {/* 기존 리스트 */}
        {!injected && (filteredOrders ?? []).length === 0 ? (
          <EmptyWrapper>
            <AlertImage src={alertImg} alt="알림 아이콘" />
            <Message>작성 가능한 리뷰가 없습니다.</Message>
          </EmptyWrapper>
        ) : (
          <CardGrid>
            {filteredOrders.map((order) => (
              <StyledGlassCard key={order.id}>
                {activeTab === "작성완료" && order.reviewData ? (
                  <ReviewCard
                    order={order}
                    reviewData={order.reviewData}
                    onDelete={handleDeleteReview}
                  />
                ) : (
                  <>
                    <ReviewableOrderCard order={{
                      orderId: order.id,
                      deadline: order.deadline ?? "",
                      item: order,                          
                    }} />
                    <ActionsDivider />
                    <ReviewActions order={{
                      orderId: order.id,
                      deadline: order.deadline ?? "",
                      item: order,
                    }} />
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
  font-family: "Prata-Regular";
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
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.35) 50%,
    rgba(255,255,255,0) 100%
  );
  opacity: 0.7;
`;