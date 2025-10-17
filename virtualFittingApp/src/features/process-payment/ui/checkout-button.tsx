import { GlassButton } from "@/shared/components/glass-button";

interface CheckoutButtonProps {
  totalAmount: number;
  onClick: () => void;
}

export const CheckoutButton = ({
  totalAmount,
  onClick,
}: CheckoutButtonProps) => {
  return (
    <GlassButton
      size="large"
      width="100%"
      onClick={onClick}
    >
      {`${totalAmount.toLocaleString()}원 결제하기`}
    </GlassButton>
  );
};
