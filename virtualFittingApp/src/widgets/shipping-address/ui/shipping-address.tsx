import { useState } from 'react';
import styled from 'styled-components';
import { GlassBox } from '@/shared/components/glass-box';
import { GlassButton } from '@/shared/components/glass-button';
import { formatPhoneNumber } from '@/shared/lib/format.util';
import { useUpdateAddress } from '@/features/update-address/hooks/use-update-address'; 
import type { UserDetail, UpdateAddressRequest } from '@/entities/user/model/types';

interface ShippingAddressWidgetProps {
  user: UserDetail;
  onSaveAddress: (data: { name: string; phoneNumber: string; address: string }) => void;
}

export const ShippingAddressWidget = ({ user, onSaveAddress }: ShippingAddressWidgetProps) => {
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState(user.address);
  const [zonecode, setZonecode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);

  const { mutate: updateAddressMutate, isPending: isUpdating } = useUpdateAddress();

  const handlePhoneChange = (v: string) => {
    const onlyDigits = v.replace(/\D/g, '');
    setPhoneNumber(onlyDigits);
  };

  const openDaumPostcode = () => {
    if (!window?.daum?.Postcode) {
      alert("주소 검색 스크립트가 로드되지 않았습니다.");
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        // 도로명 주소 우선, 없으면 지번 주소
        const road = data.roadAddress?.trim();
        const jibun = data.jibunAddress?.trim();
        setAddress(road || jibun || "");
        setZonecode(data.zonecode || "");
      },
    }).open();
  };

  const handleSave = () => {
    if (!address || address.trim().length < 5) {
      alert('유효한 주소를 입력해 주세요.');
      return;
    }
    if (!name || name.trim().length < 2) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('전화번호를 확인해 주세요.');
      return;
    }

    const updateData: UpdateAddressRequest = {
      name: name,
      address: address,
      phoneNumber: phoneNumber,
    };
    
    updateAddressMutate({ userId: user.id, addressData: updateData }, {
        onSuccess: () => {
          onSaveAddress({
            name: updateData.name,
            phoneNumber: updateData.phoneNumber,
            address: updateData.address,
          });
        }
    });
  };

  const nothingChanged =
    (user.name ?? '') === name.trim() &&
    (user.address ?? '') === address.trim() &&
    (user.phoneNumber ?? '') === phoneNumber

  const isSaveDisabled = isUpdating || nothingChanged;

  return (
    <GlassBox>
      <Header>
        <SectionTitle>배송지</SectionTitle>
        <GlassButton onClick={handleSave} size='small' disabled={isSaveDisabled}>
            배송지 변경
        </GlassButton>
      </Header>
      <CardContainer>
        <Label>받는분</Label>
        <InputField
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isUpdating}
          placeholder="수령인 이름"
        />

        <Label>주소</Label>
        <AddressRow>
          <InputField
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isUpdating}
            placeholder="도로명주소 + 상세주소"
          />
          <SearchBtn onClick={openDaumPostcode} size='small' disabled={isUpdating}>
            검색
          </SearchBtn>
        </AddressRow>

        <Label>전화번호</Label>
        <InputField
          type="tel"
          inputMode="numeric"
          value={formatPhoneNumber(phoneNumber)}  
          onChange={(e) => handlePhoneChange(e.target.value)}
          disabled={isUpdating}
          placeholder="010 부터 입력해주세요."
        />

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

const Label = styled.label`
  font-size: 13px;
  color: rgba(255,255,255,0.75);
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

const AddressRow = styled.div`
  display: flex; gap: 8px;
  & > input { flex: 1; } /* 입력칸이 남는 너비 채우게 */
`;

const SearchBtn = styled(GlassButton)`
  white-space: nowrap;
`;