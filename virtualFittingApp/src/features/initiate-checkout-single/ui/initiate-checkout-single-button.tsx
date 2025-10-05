import { GlassButton } from "@/shared/components/glass-button";

type InitiateCheckoutSingleButtonProps = {
  onClick?: () => void;
};

export function InitiateCheckoutSingleButton({ onClick }: InitiateCheckoutSingleButtonProps) {
  return <GlassButton onClick={onClick} width="200px">
    BUY NOW
  </GlassButton>;
}
