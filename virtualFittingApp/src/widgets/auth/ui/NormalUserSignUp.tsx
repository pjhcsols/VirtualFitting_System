import { FemaleIcon, MaleIcon } from "@/shared";
import styled from "styled-components";
import type { ChangeEvent } from "react";
import dayjs, { Dayjs } from "dayjs";
import { NormalUserSignUpRequestDto } from "../types/login";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type NormalUserSignUpType = {
  signUpInfo: NormalUserSignUpRequestDto;
  phoneNumber: any;
  onChangePhoneNumber: (name: string, e: ChangeEvent<HTMLInputElement>) => void;
  onChangeDatePicker: (value: Dayjs | null) => void;
  onClickGender: (gender: "MALE" | "FEMALE") => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (name: string) => void;
};

function NormalUserSignUp({
  onBlur,
  onChange,
  onChangePhoneNumber,
  onChangeDatePicker,
  onClickGender,
  phoneNumber,
  signUpInfo,
}: NormalUserSignUpType) {
  return (
    <Wrapper>
      <InputContainer>
        <InputTitle>아이디</InputTitle>
        <Input
          type="text"
          name="signupId"
          value={signUpInfo.id}
          onChange={onChange}
          onBlur={() => onBlur("signupId")}
        />
      </InputContainer>
      <InputContainer>
        <InputTitle>비밀번호</InputTitle>
        <Input
          type="password"
          name="password"
          value={signUpInfo.password}
          onChange={onChange}
          onBlur={() => onBlur("password")}
        />
      </InputContainer>
      <InputContainer>
        <InputTitle>이름</InputTitle>
        <Input
          type="text"
          name="name"
          value={signUpInfo.name}
          onChange={onChange}
          onBlur={() => onBlur("name")}
        />
      </InputContainer>
      <PhoneNumberGenderContainer>
        <PhoneNumberContainer>
          <InputTitle>휴대전화</InputTitle>
          <PhoneNumberBox>
            <PhoneNumberInput
              value={phoneNumber.part1}
              onChange={(e) => onChangePhoneNumber("part1", e)}
            />
            <PhoneNumberInput
              value={phoneNumber.part2}
              onChange={(e) => onChangePhoneNumber("part2", e)}
            />
            <PhoneNumberInput
              value={phoneNumber.part3}
              onChange={(e) => onChangePhoneNumber("part3", e)}
            />
          </PhoneNumberBox>
        </PhoneNumberContainer>
        <GenderContainer>
          <InputTitle>성별</InputTitle>
          <GenderRowBox>
            <GenderBox
              onClick={() => onClickGender("MALE")}
              checked={signUpInfo.gender === "MALE"}
            >
              <MaleIcon width="24px" height="24px" fill="black" />
            </GenderBox>
            <GenderBox
              onClick={() => onClickGender("FEMALE")}
              checked={signUpInfo.gender === "FEMALE"}
            >
              <FemaleIcon width="24px" height="24px" fill="black" />
            </GenderBox>
          </GenderRowBox>
        </GenderContainer>
      </PhoneNumberGenderContainer>
      <InputContainer>
        <InputTitle>별명</InputTitle>
        <Input
          type="text"
          name="nickname"
          value={signUpInfo.nickname}
          onChange={onChange}
          onBlur={() => onBlur("nickname")}
        />
      </InputContainer>
      <InputContainer>
        <InputTitle>주소</InputTitle>
        <Input
          type="text"
          name="address"
          value={signUpInfo.address}
          onChange={onChange}
          onBlur={() => onBlur("address")}
        />
      </InputContainer>
      <InputContainer>
        <InputTitle>생일</InputTitle>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={dayjs(signUpInfo.birthDate)}
            onChange={(value) => onChangeDatePicker(value)}
          />
        </LocalizationProvider>
      </InputContainer>
    </Wrapper>
  );
}

export { NormalUserSignUp };

const Wrapper = styled.section`
  box-sizing: border-box;
  padding: 0rem 0rem 5rem 0rem;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const InputTitle = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: black;
`;

const Input = styled.input`
  box-sizing: border-box;
  padding: 0.75rem 1rem 0.75rem 2rem;
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
  background-color: transparent;
  &:focus {
    border: 1px solid #121519;
    outline: none;
  }
`;

const GenderContainer = styled.div`
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const GenderRowBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const GenderBox = styled.div<{ checked: boolean }>`
  min-width: 8rem;
  min-height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => (props.checked ? "#24ae52" : "#d9d9d9")};
  cursor: pointer;
`;

const PhoneNumberGenderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const PhoneNumberContainer = styled.div`
  width: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const PhoneNumberBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 0.75rem;
`;

const PhoneNumberInput = styled.input`
  box-sizing: border-box;
  padding: 1rem;
  min-width: 5rem;
  max-width: 5rem;
  border: 1px solid #d9d9d9;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
  background-color: transparent;
  &:focus {
    border: 1px solid #121519;
    outline: none;
  }
`;
