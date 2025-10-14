import { GlassButton } from "@/shared/components/glass-button";

type AddToCartButtonProps = {
  onClick: () => void;
};

function AddToCartButton({ onClick }: AddToCartButtonProps) {
  return (
    <GlassButton onClick={onClick} width="200px">
      ADD TO CART
    </GlassButton>
  );
}

export { AddToCartButton };
