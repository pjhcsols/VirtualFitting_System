import React from 'react';
import styled from 'styled-components';
import { GlassButton } from '@/shared/components/glass-button';

interface ConfirmCheckoutSingleButtonProps {
  totalAmount: number;
  isLoading?: boolean;
  onClick: () => void;
}

export const ConfirmCheckoutSingleButton = ({
  totalAmount,
  isLoading,
  onClick,
}: ConfirmCheckoutSingleButtonProps) => {
  return (
    <SubmitButton onClick={onClick} disabled={isLoading}>
      {isLoading
        ? '결제 처리 중...'
        : `${totalAmount.toLocaleString()}원 결제하기`}
    </SubmitButton>
  );
};

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 16px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: #000;
  color: #fff;

  &:disabled {
    background-color: #888;
    cursor: not-allowed;
  }
`;