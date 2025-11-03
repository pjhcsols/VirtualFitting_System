import { useState } from 'react';
import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import { GlassButton } from '@/shared/components/glass-button';
import { formatPhoneNumber } from '@/shared/lib/format.util';
import { useUpdateAddress } from '@/features/update-address/hooks/use-update-address'; 
import type { UserDetail, UpdateAddressRequest } from '@/entities/user/model/types';

interface ShippingAddressWidgetProps {
  user: UserDetail;
  onSaveAddress: () => void;
}

export const ShippingAddressWidget = ({ user, onSaveAddress }: ShippingAddressWidgetProps) => {
  const [address, setAddress] = useState(user.address);

  const { mutate: updateAddressMutate, isPending: isUpdating } = useUpdateAddress();

  const handleSave = () => {
    if (!address || address.trim().length < 5) {
        alert("유효한 주소를 입력해 주세요.");
        return;
    }

    const updateData: UpdateAddressRequest = {
        address: address,
    };
    
    updateAddressMutate({ userId: user.id, addressData: updateData }, {
        onSuccess: () => {
            onSaveAddress();
        }
    });
  };

  const isSaveDisabled = isUpdating || address === user.address;

  return (
    <GlassBox>
      <Header>
        <SectionTitle>배송지</SectionTitle>
        <GlassButton onClick={handleSave} size='small' disabled={isSaveDisabled}>
            배송지 변경
        </GlassButton>
      </Header>
      <CardContainer>
        <Name>{user.name}</Name>
        <InputField 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            disabled={isUpdating}
        />
        
        <InfoText>{formatPhoneNumber(user.phoneNumber)}</InfoText>
      </CardContainer>
    </GlassBox>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* 간격 조정 */
  padding: 24px;
  text-align: left;
`;

const Name = styled.p`
  font-weight: 600;
  font-size: 14px;
  color: white;
  margin: 0;
`;

const InputField = styled.input`
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: white;
    font-size: 14px;
    transition: border-color 0.2s;
    
    &:disabled {
        opacity: 0.7;
    }
    &:focus {
        outline: none;
        border-color: #63cfef;
    }
`;

const InfoText = styled.p`
  font-size: 14px;
  color: white;
  line-height: 1.4;
  margin: 0;
`;