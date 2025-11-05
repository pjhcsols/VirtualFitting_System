import styled from "styled-components";

interface ProductCouponButtonProps {
  onClick: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
}

export const ProductCouponButton = ({ onClick }: ProductCouponButtonProps) => {
  return (
      <CouponButton onClick={onClick}>쿠폰다운</CouponButton>
  );
};

const CouponButton = styled.button`
  margin-left: auto;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.4);
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
