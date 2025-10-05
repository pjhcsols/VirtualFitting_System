import { GlassButton } from "@/shared/components/glass-button";

type InitiateCheckoutCartButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  totalAmount: number;
};

export function InitiateCheckoutCartButton({ onClick, disabled, totalAmount }: InitiateCheckoutCartButtonProps) {
  return (
    <GlassButton 
      onClick={onClick} 
      disabled={disabled} 
      size="large" 
      width="100%"
    >
      {totalAmount.toLocaleString()}원 주문하기
    </GlassButton>
  );
}
