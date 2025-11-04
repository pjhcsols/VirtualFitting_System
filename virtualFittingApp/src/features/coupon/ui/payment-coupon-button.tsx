import { GlassButton } from '@/shared/components/glass-button';

interface PaymentCouponButtonProps {
  onClick: () => void;
}

export const PaymentCouponButton = ({ onClick }: PaymentCouponButtonProps) => {
  return (
      <GlassButton onClick={onClick} size='small'>쿠폰적용</GlassButton>
  );
};
