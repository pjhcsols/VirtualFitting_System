import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { OrderItem } from "@/entities/order";

type ReviewActionsProps = {
  order: OrderItem;
};

export function ReviewActions({ order }: ReviewActionsProps) {
  const navigate = useNavigate();
  return (
    <ButtonWrapper>
      <ActionButton>
        전체 리뷰
      </ActionButton>
      <ActionButton onClick={() => navigate(`/mypage/review/${order.id}`)}>
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
`;

export const ActionButton = styled.button`
  flex:1;
  height:40px;
  border:none;
  border-radius:6px;
  background:#292E49;
  color:rgba(255,255,255,0.9);
  font-size:14px;
  font-family:"Prata-Regular";
  cursor:pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;
