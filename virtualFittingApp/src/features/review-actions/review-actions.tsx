import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import type { ReviewOrderPayload } from "@/entities/order";
import { GlassButton } from "@/shared/components/glass-button";
import { BREAKPOINTS } from "@/shared";

type ReviewActionsProps = {
  order: ReviewOrderPayload;
};

export function ReviewActions({ order }: ReviewActionsProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/mypage/review/${order.item.id}`, { state: order });
  };

  return (
    <ButtonWrapper>
      <ActionButton size="medium" aria-label="전체 리뷰 보기">
        전체 리뷰
      </ActionButton>

      <ActionButton
        size="medium"
        onClick={handleNavigate}
        aria-label="스타일 리뷰 작성"
      >
        스타일 리뷰
      </ActionButton>
    </ButtonWrapper>
  );
}

export const ButtonWrapper = styled.div`
  display:flex;
  margin-top: 12px;
  gap: 12px;
  justify-content:flex-start;

   @media (max-width: ${BREAKPOINTS.md}px) {
    flex-direction: column;
  }
`;

export const ActionButton = styled(GlassButton)`
  flex: 1;
  width: 100%;
`;
