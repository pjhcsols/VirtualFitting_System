import { GlassButton } from '@/shared/components/glass-button';

type ChangeShippingAddressButtonProps = {
  onClick: () => void;
};

function ChangeShippingAddressButton({ onClick }: ChangeShippingAddressButtonProps) {
  return (
    <GlassButton onClick={onClick} size='small'>
      배송지 변경
    </GlassButton>
  );
}

export { ChangeShippingAddressButton };
