import { ChangeEvent } from "react";
import styled from "styled-components";

type LoginInputType = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function LoginInput({ value, onChange }: LoginInputType) {
  return (
    <InputWrapper>
      <LoginInputContainer value={value} onChange={onChange} required />
      <DefaultOutline>ID</DefaultOutline>
    </InputWrapper>
  );
}

function PasswordInput({ value, onChange }: LoginInputType) {
  return (
    <InputWrapper>
      <PasswordInputContainer
        name="password"
        value={value}
        onChange={onChange}
        required
      />
      <DefaultOutline>PASSWORD</DefaultOutline>
    </InputWrapper>
  );
}

type SignUpInputType = {
  title: string;
  value: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
};

function SignUpTextInfoInput({
  title,
  name,
  value,
  onBlur,
  onChange,
}: SignUpInputType) {
  return (
    <InputWrapper>
      <SignUpIdInput
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required
      />
      <DefaultOutline>{title}</DefaultOutline>
    </InputWrapper>
  );
}

function SignUpPhoneNumberInput({
  title,
  name,
  value,
  onBlur,
  onChange,
}: SignUpInputType) {
  return (
    <InputWrapper>
      <SignUpIdInput
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required
      />
      <DefaultOutline>{title}</DefaultOutline>
    </InputWrapper>
  );
}

function EmailAddressInput({ value, onChange }: SignUpInputType) {
  return (
    <InputWrapper>
      <SignUpEmailInput
        name="emailAddress"
        value={value}
        onChange={onChange}
        required
      />
      <DefaultOutline>EMAIL</DefaultOutline>
    </InputWrapper>
  );
}

function AddressInput({ value, onChange }: SignUpInputType) {
  return (
    <InputWrapper>
      <SignUpAddressInput
        name="address"
        value={value}
        onChange={onChange}
        required
      />
      <DefaultOutline>ADDRESS</DefaultOutline>
    </InputWrapper>
  );
}

function BirthdayInput({ value, onChange }: SignUpInputType) {
  return (
    <InputWrapper>
      <SignUpBirthdayInput
        name="birthDate"
        value={value}
        onChange={onChange}
        required
      />
      <DefaultOutline>생일</DefaultOutline>
    </InputWrapper>
  );
}

export {
  LoginInput,
  PasswordInput,
  EmailAddressInput,
  AddressInput,
  BirthdayInput,
  SignUpTextInfoInput,
  SignUpPhoneNumberInput,
};

const InputWrapper = styled.div`
  width: 100%;
  height: 45px;
  line-height: 45px;
  position: relative;
`;

const DefaultOutline = styled.label`
  left: 0;
  position: absolute;
  font-size: 1.2rem;
  color: #121518;
  padding: 0 10px;
  margin: 0 20px;
  transition: 0.2s ease;
  text-transform: uppercase;
`;

const DefaultInput = styled.input`
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding: 0 40px;
  line-height: 40px;
  border: 1px solid #121212;
  border-radius: 5px;
  outline: none;
  background-color: transparent;
  transition: 0.1s ease;
  z-index: 10;
  color: black;
  &:focus {
    color: #121518;
    border: 2px solid #121518;
  }
  &:focus + label {
    color: #121518;
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    background-color: #fffafa;
    transform: translate(-10%, -45%) scale(0.88);
    z-index: 10;
  }
`;

const LoginInputContainer = styled(DefaultInput).attrs({ type: "text" })``;

const PasswordInputContainer = styled(DefaultInput).attrs({
  type: "password",
})``;

const SignUpIdInput = styled(DefaultInput).attrs({ type: "text" })``;

const SignUpEmailInput = styled(DefaultInput).attrs({ type: "email" })``;

const SignUpAddressInput = styled(DefaultInput).attrs({ type: "text" })``;

const SignUpBirthdayInput = styled.input.attrs({ type: "datetime-local" })``;
