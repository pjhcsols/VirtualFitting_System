import styled from "styled-components";
import { useState } from "react";
import { useProductCoupon } from '../hooks/use-product-coupon';
import { GlassButton } from '@/shared/components/glass-button';
import { GlassBox } from "@/shared/components/glass-box";
import type { ClaimableCoupon } from '@/entities/coupon';
import { Portal } from "@/shared/ui/Portal";

interface ProductCouponProps {
  productId: number;
  finalPrice: number;
  onSelect: (coupon: ClaimableCoupon | null) => void;
}

export const ProductCoupon = ({ productId, finalPrice, onSelect }: ProductCouponProps) => {
  const { coupons, isLoading } = useProductCoupon(productId);
  const [showPopup, setShowPopup] = useState(false);
  const [tempSelectedCoupon, setTempSelectedCoupon] = useState<ClaimableCoupon | null>(null);

  const handleApply = () => {
    onSelect(tempSelectedCoupon);
    setShowPopup(false);
  };

  return (
    <>
      <GlassButton onClick={() => setShowPopup(true)} size="small">
        쿠폰 적용
      </GlassButton>

      <Portal>
        {showPopup && (
          <PopupOverlay onClick={() => setShowPopup(false)}>
            <PopupContent onClick={(e) => e.stopPropagation()}>
              <PopupHeader>
                <Title>쿠폰 사용</Title>
                <CloseButton onClick={() => setShowPopup(false)}>×</CloseButton>
              </PopupHeader>
              
              {isLoading ? (
                <StatusText>쿠폰을 불러오는 중...</StatusText>
              ) : coupons.length > 0 ? (
                <CouponList>
                  {coupons.map(coupon => {
                    const isUsable = coupon.remainingCanClaim > 0 && finalPrice >= coupon.minOrderPrice;
                    return (
                      <CouponItemLabel key={coupon.campaignId} disabled={!isUsable}>
                        <RadioButton 
                          type="radio"
                          name="coupon"
                          checked={tempSelectedCoupon?.campaignId === coupon.campaignId}
                          onChange={() => setTempSelectedCoupon(coupon)}
                          disabled={!isUsable}
                        />
                        <CouponInfo>
                          <DiscountLine>
                            <DiscountAmount>{coupon.percent}% 할인</DiscountAmount>
                            <Tag>{coupon.scope}</Tag>
                          </DiscountLine>
                          <Description>최대 {coupon.maxDiscountPrice.toLocaleString()}원 할인</Description>
                          <Expiry>
                            {new Date(coupon.endAt).toLocaleDateString()}까지
                          </Expiry>
                        </CouponInfo>
                      </CouponItemLabel>
                    );
                  })}
                </CouponList>
              ) : (
                <StatusText>사용 가능한 쿠폰이 없습니다.</StatusText>
              )}
              
              <ApplyButton onClick={handleApply} disabled={!tempSelectedCoupon}>
                적용하기
              </ApplyButton>
            </PopupContent>
          </PopupOverlay>
        )}
      </Portal>
    </>
  );
};

const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: #292e49d0;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 16px;
`;

const PopupContent = styled(GlassBox)`
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #fff; }
`;

const CouponList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1rem;
  flex: 1;
`;

const CouponItemLabel = styled.label<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.5)'};
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const RadioButton = styled.input`
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #888;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s;

  &:checked {
    border-color: #fff;
  }

  &:checked::before {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const CouponInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DiscountLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DiscountAmount = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ccc;
`;

const Description = styled.span`
  font-size: 0.9rem;
  color: #ccc;
`;

const Expiry = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

const ApplyButton = styled(GlassButton)`
  width: calc(100% - 2rem);
  margin: 1rem;
  flex-shrink: 0;
`;


const StatusText = styled.p`
  padding: 3rem 1rem;
  text-align: center;
  color: #888;
`;