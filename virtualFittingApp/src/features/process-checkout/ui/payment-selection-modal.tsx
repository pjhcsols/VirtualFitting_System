import styled, { css } from "styled-components";
import { useState } from "react";
import { Portal } from "@/shared/ui/Portal";
import type { TossPaymentMethod } from "@/shared/types/payment";
import type { CheckoutItemDetail } from '@/shared/types/checkout';
import type { ClaimableCoupon } from '@/entities/coupon';

export type PaymentProvider = TossPaymentMethod;

interface PaymentSelectionModalProps {
  item: CheckoutItemDetail;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedMethod: PaymentProvider) => void;
  totalAmount: number;
  selectedCoupon: ClaimableCoupon | null;
}

const paymentGroups: { title: string; options: { key: PaymentProvider, name: string, enabled: boolean }[] }[] = [
  {
    title: '일반결제',
    options: [
      { key: 'BANK_TRANSFER', name: '무통장입금', enabled: true },
      { key: 'CARD', name: '신용 · 체크카드', enabled: false  },
    ]
  },
  {
    title: '간편결제',
    options: [
      { key: 'TOSS_PAY', name: '토스페이', enabled: false  },
      { key: 'NAVER_PAY', name: '네이버페이', enabled: false  },
      
    ]
  },
];

export function PaymentSelectionModal({ isOpen, onClose, onConfirm, totalAmount, item }: PaymentSelectionModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentProvider>('BANK_TRANSFER');
  const [agreed, setAgreed] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <Overlay onClick={onClose}>
        <Content onClick={(e) => e.stopPropagation()}>
          <LeftPanel>
            <Header>
              <Title>결제 방법을 선택해주세요</Title>
            </Header>
            <MethodList>
              {paymentGroups.map(group => (
                <MethodGroup key={group.title}>
                  <MethodTitle>{group.title}</MethodTitle>
                  <MethodRow>
                    {group.options.map(option => (
                      <MethodButton 
                        key={option.key}
                        onClick={() => setSelectedMethod(option.key)}
                        $isSelected={selectedMethod === option.key}
                        disabled={!option.enabled}
                      >
                        <MethodName>{option.name}</MethodName>
                      </MethodButton>
                    ))}
                  </MethodRow>
                </MethodGroup>
              ))}
            </MethodList>
            <AgreementBox>
              <Checkbox 
                type="checkbox" 
                id="modal-agreement" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)} 
              />
              <AgreementLabel htmlFor="modal-agreement">
                상기 결제 내역을 확인했으며, 결제 진행에 동의합니다.
              </AgreementLabel>
            </AgreementBox>
            <ConfirmButton
              onClick={() => onConfirm(selectedMethod)}

              disabled={!agreed} 
            >
              {totalAmount.toLocaleString()}원 결제하기
            </ConfirmButton>
          </LeftPanel>
          <RightPanel>
            <CloseButton onClick={onClose}>×</CloseButton>
            <ProductInfo>
              <ProductTitle>상품명</ProductTitle>
              <Name>{item.name}</Name>
              <ProductTitle>결제 금액</ProductTitle>
              <Price>{`${totalAmount.toLocaleString()}원`}</Price>
            </ProductInfo>
          </RightPanel>
        </Content>
      </Overlay>
    </Portal>
  );
}

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 9999999;
  transform: translateZ(0px);
  background-color: rgba(0, 0, 0, 0.6);
  margin: 0px;
  padding: 0px;
  pointer-events: auto;
`;

const Content = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 660px;
  background-color: white;
  margin: auto;
  padding: 0px;
  display: flex;
  flex-direction: row;
  border-radius: 16px;
`;

const LeftPanel = styled.div`
  -webkit-box-align: stretch;
  align-items: stretch;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  padding: 0px 24px 24px 24px;
  width: 392px;
  flex: 1 1;
`;

const RightPanel = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: start;
  justify-content: flex-start;
  padding: 20px;
  background-color: rgb(249, 250, 251);
  max-width: 30%;
  width: 160px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0px;
`;

const Title = styled.h2`
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  position: fixed;
  right: 18px;
  top: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: #a0a0a0;
  cursor: pointer;
  &:hover { color: #000; }
`;

const MethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const MethodGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MethodRow = styled.div`
  display: flex;
  gap: 8px;
`;

const AgreementBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 14px;
`;

const MethodTitle = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #888;
  margin: 0px 0 0px 0px;
`;

const MethodButton = styled.button<{ $isSelected: boolean }>`
  width: 125px;
  height: 70px;
  background-color: rgba(2, 32, 71, 0.05);
  border-radius: 12px;
  border: none;
  transition: background-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
  text-align: center;
  margin-bottom: 16px;

  &:hover {
    background-color: rgba(2, 32, 71, 0.1);
  }

  ${props => props.$isSelected && css`
    background-color: rgba(49, 130, 246, 0.08);
  `}

  &:disabled {
    cursor: not-allowed;
  }
`;

const MethodName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #333;
`;

const ProductInfo = styled.div`
  text-align: left;
  margin-top: 40px;
`;

const ProductTitle = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #888;
  margin: 14px 0 2px 0;
`;

const Name = styled.p`
  font-size: 14px;
  margin: 0px;
  color: #555;
`;

const Price = styled.p`
  font-size: 24px;
  color: #000;
  font-weight: 600;
  margin: 0px;
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 16px;
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  background-color: #394065;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #292E49;
  }
`;


const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  border: 1.5px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #fff;
  display: inline-block;
  position: relative;
  transition: all 0.15s ease;

  &:checked {
    background-color: #394065;
    border-color: #394065;
  }

  &:checked::after {
    content: "";
    position: absolute;
    width: 4px;
    height: 8px;
    border: solid #fff;
    border-width: 0 2px 2px 0;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
  }
`;

const AgreementLabel = styled.label`
  font-size: 13px;
  color: #555;
  cursor: pointer;
`;