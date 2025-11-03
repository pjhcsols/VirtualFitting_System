import styled from "styled-components";
import { useState, useMemo } from "react";
import { useProductCoupon } from '../hooks/use-product-coupon';
import { GlassButton } from '@/shared/components/glass-button';
import { GlassBox } from "@/shared/components/glass-box";
import type { ClaimableCoupon } from '@/entities/coupon';
import { Portal } from "@/shared/ui/Portal";

interface ProductCouponProps {
  productId: number;
  finalPrice: number;
  onSelect: (coupon: ClaimableCoupon | null) => void;
  currentSelectedCoupon: ClaimableCoupon | null;
}

export const ProductCoupon = ({ 
  productId, 
  finalPrice, 
  onSelect,
  currentSelectedCoupon 
}: ProductCouponProps) => {
  
  const { 
    coupons, 
    isLoading,
    handleDownloadCoupon 
  } = useProductCoupon(productId);

  const [showPopup, setShowPopup] = useState(false);
  const [tempSelectedCoupon, setTempSelectedCoupon] = useState<ClaimableCoupon | null>(null);

  const availableCoupons = useMemo(() => {
    const now = new Date();

    return coupons.filter(coupon => {
      const isExpired = new Date(coupon.endAt) < now;
      if (isExpired) return false;

      const isMinPriceMet = finalPrice >= coupon.minOrderPrice;
      if (!isMinPriceMet) return false;
      
      const canDownloadOrUse = coupon.ownedCount > 0 || coupon.remainingCanClaim > 0;
      
      return canDownloadOrUse;
    });
  }, [coupons, finalPrice]);

  const handleOpenPopup = () => {
    setTempSelectedCoupon(currentSelectedCoupon); 
    if (!currentSelectedCoupon && availableCoupons.length > 0) {
        setTempSelectedCoupon(availableCoupons[0]);
    }
    
    setShowPopup(true);
  };
  const handleApply = async () => {
    if (tempSelectedCoupon === null) {
      onSelect(null); 
      setShowPopup(false);
      return;
    }
    const hasWalletIdForUse = tempSelectedCoupon.walletId !== null && tempSelectedCoupon.walletId !== undefined;
    console.log(
        "[Coupon Apply] Selected Coupon Info:", 
        { 
            campaignId: tempSelectedCoupon.campaignId, 
            walletId: tempSelectedCoupon.walletId, 
            ownedCount: tempSelectedCoupon.ownedCount,
            hasWalletIdForUse: hasWalletIdForUse
        }
    );

    if (hasWalletIdForUse) {
      onSelect(tempSelectedCoupon);
      setShowPopup(false);
    } else {
      if (tempSelectedCoupon.remainingCanClaim > 0) {
        
        console.log("Wallet ID가 없어 새로 다운로드 시도합니다. (remainingCanClaim > 0)");

        const downloadedWalletId = await handleDownloadCoupon(tempSelectedCoupon.campaignId);
      
        if (downloadedWalletId !== null) {

          const latestCouponData = coupons.find(c => c.campaignId === tempSelectedCoupon.campaignId);
          
          if (latestCouponData) {
              const newlySelectedCoupon: ClaimableCoupon = {
                ...latestCouponData,
                walletId: downloadedWalletId,
              };
              
              onSelect(newlySelectedCoupon);
              setTempSelectedCoupon(newlySelectedCoupon);
              setShowPopup(false);
          } else {
              alert('쿠폰 다운로드는 성공했지만, 최신 쿠폰 데이터를 불러오는 데 실패했습니다.');
              const partialCoupon: ClaimableCoupon = { ...tempSelectedCoupon, walletId: downloadedWalletId };
              onSelect(partialCoupon);
              setShowPopup(false);
          }
        } else {
          alert('쿠폰 다운로드에 실패했습니다. (수량 소진 등을 확인하세요)');
        }
      } else {
          alert('쿠폰을 다운로드할 수 없습니다. 발급 제한을 확인하세요.');
      }
    }
  };

  return (
    <>
      <GlassButton onClick={handleOpenPopup} size="small">
        쿠폰 적용
      </GlassButton>
      <Portal>
        {showPopup && (
          <PopupOverlay onClick={() => setShowPopup(false)}>
            <PopupContent onClick={(e) => e.stopPropagation()}>
              <PopupHeader>
                <Title>쿠폰 선택</Title>
                <CloseButton onClick={() => setShowPopup(false)}>×</CloseButton>
              </PopupHeader>
              
              {isLoading ? (
                <StatusText>쿠폰을 불러오는 중...</StatusText>
              ) : (
                <CouponList>
                  {availableCoupons.length > 0 ? (
                    <CouponListSection>
                      {availableCoupons.map(coupon => {
                        const isDisabled = false; 
                        
                        const isCurrentlySelected = tempSelectedCoupon?.campaignId === coupon.campaignId;
                        const calculatedDiscount = Math.floor(finalPrice * (coupon.percent / 100));
                        const finalDiscountAmount = Math.min(
                            calculatedDiscount,
                            coupon.maxDiscountPrice
                        );
                        return (
                          <CouponItemLabel 
                            key={coupon.campaignId} 
                            disabled={isDisabled}
                            $ischecked={isCurrentlySelected}
                          >
                            <RadioButton 
                              type="radio"
                              name="coupon"
                              checked={isCurrentlySelected}
                              onChange={() => setTempSelectedCoupon(coupon)}
                              disabled={isDisabled}
                            />
                            <CouponInfo>
                              <DiscountLine>
                                <DiscountAmount>{finalDiscountAmount.toLocaleString()}원 할인</DiscountAmount>
                                {isCurrentlySelected && (
                                  <UnapplyButton
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault(); 
                                      e.stopPropagation(); 
                                      setTempSelectedCoupon(null);
                                    }}
                                  >
                                    미적용
                                  </UnapplyButton>
                                )}
                              </DiscountLine>
                              <DiscountLine>
                              <Tag>{coupon.scope}</Tag>
                              <Description>{coupon.percent}% 할인</Description>
                              </DiscountLine>
                              <Description>최대 {coupon.maxDiscountPrice.toLocaleString()}원 할인</Description>
                              <Expiry>
                                {new Date(coupon.endAt).toLocaleDateString()}까지
                              </Expiry>
                            </CouponInfo>
                          </CouponItemLabel>
                        );
                      })}
                    </CouponListSection>
                  ) : (
                     <StatusText style={{ padding: '1rem 0', textAlign: 'center', flex: 1 }}>
                        사용 가능한 쿠폰이 없습니다.
                     </StatusText>
                  )}
                </CouponList>
              )}
              
              <ApplyButton 
                onClick={handleApply} 
                disabled={isLoading || (tempSelectedCoupon?.campaignId === currentSelectedCoupon?.campaignId && tempSelectedCoupon !== null)}
              >
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

const CouponListSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const CouponItemLabel = styled.label<{ disabled: boolean, $ischecked?: boolean }>`
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

  ${props => props.$ischecked && `
    border-color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
  `}

  &:hover {
    border-color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.15)' : (props.$ischecked ? '#ffffff' : 'rgba(255, 255, 255, 0.5)')};
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const RadioButton = styled.input`
  appearance: none;
  -webkit-appearance: none;
  width: 22px;
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
  width: 100%;
`;

const DiscountLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DiscountAmount = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
`;

const Tag = styled.span`
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ccc;
`;

const Description = styled.span`
  font-size: 14px;
  color: #ccc;
`;

const Expiry = styled.span`
  font-size: 14px;
  color: #bdbdbd;
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

const UnapplyButton = styled.button`
  margin-left: auto;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ccc;
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
