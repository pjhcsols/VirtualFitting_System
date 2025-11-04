import { GlassButton } from "@/shared/components/glass-button";

type InitiateCheckoutCartButtonProps = {
  onClick?: () => void;
  totalAmount: number;
};

export function InitiateCheckoutCartButton({ onClick, totalAmount }: InitiateCheckoutCartButtonProps) {
  return (
    <GlassButton 
      onClick={onClick} 
      size="large" 
      width="100%"
    >
      {totalAmount.toLocaleString()}원 주문하기
    </GlassButton>
  );
}
