import React from 'react';

interface PaymentButtonProps {
  onClick: () => void;
  label: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ onClick, label }) => {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
};

export default PaymentButton;
