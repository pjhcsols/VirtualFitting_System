import styled from "styled-components";
import { type EmailVerificationInputProps } from "@/pages/my/types/email";


export const EmailVerificationInput = ({ authCode, onChange, onVerify }: EmailVerificationInputProps) => {
  return (
    <FormField>
      <Label>인증번호</Label>
      <TelForm>
        <PhoneInput
          placeholder="인증번호 입력"
          value={authCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
        <CheckButton type="button" onClick={onVerify}>
          확인
        </CheckButton>
      </TelForm>
    </FormField>
  );
};


const FormField = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  flex: 0 0 120px;
  font-size: 14px;
  color: #202429;
`;

const TelForm = styled.div`
  display: flex;
  gap: 10px;
`;

const PhoneInput = styled.input`
  width: 210px;
  padding: 10px;
  border: 1px solid #e4e6e9;
  border-radius: 6px;
  font-size: 14px;
`;

const CheckButton = styled.button`
  width: 80px;
  height: 40px;
  background-color: #d9d9d9;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
      background-color: #000000; 
    }
`;
