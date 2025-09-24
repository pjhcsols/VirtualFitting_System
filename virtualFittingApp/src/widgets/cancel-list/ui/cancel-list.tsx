import styled from 'styled-components';
import { useCancelList } from "../hooks/use-cancle-list";
import { CancelListFilter } from "@/features/cancel-list-filter";
import { CanceledOrderCard } from '@/entities/order';
import { BREAKPOINTS } from '@/shared';

export function CancelList() {
  const { filteredOrders, activeTab, setActiveTab, isLoading, error } = useCancelList();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류가 발생했습니다.</div>;

  return (
    <OuterWrapper>
      <CancelListFilter
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      <ContentWrapper>
        {filteredOrders.length === 0 ? (
          <EmptyWrapper>...</EmptyWrapper>
        ) : (
          <CardGrid>
            {filteredOrders.map((order) => (
              <CanceledOrderCard key={order.id} order={order} />
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
  padding: 20px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 0 16px;
    max-width: 100%;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
`;