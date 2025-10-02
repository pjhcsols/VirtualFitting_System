import { Flags } from "../../constants";
import { Flag } from "../../types/auth";
import { Korea } from "../icon";
import * as S from "./style";

import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

interface IPhoneNumber {
  phoneNumber: string;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
}

function PhoneNumber({ phoneNumber, setPhoneNumber }: IPhoneNumber) {
  const flags: Flag[] = Flags;
  const [flag, setFlag] = useState<Flag>({
    country: "KOR",
    countryCode: "+82)",
    countryIcon: Korea,
  });
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [phoneCall, setPhoneCall] = useState<string[]>(
    convertNumber(phoneNumber),
  );

  const onClickFlag = (flag: Flag) => {
    setFlag(flag);
    setIsSelect((prev) => !prev);
  };

  const onChangePhoneNumber = (
    idx: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    if (idx > 3 || idx < 0) {
      return;
    }
    const changedPhoneCall: string[] = phoneCall;
    changedPhoneCall[idx] = value;
    setPhoneCall(changedPhoneCall);
    setPhoneNumber(convertToInternational(phoneCall, flag));
  };
  return (
    <S.Wrapper>
      <S.FlagButtonContainer>
        <S.FlagButton onClick={() => setIsSelect((prev) => !prev)}>
          {flag.countryCode}
        </S.FlagButton>
        {isSelect && (
          <S.FlagButtonBox>
            {flags.map((item: Flag, key: number) => {
              return (
                <S.FlagButton key={key} onClick={() => onClickFlag(item)}>
                  {item.countryCode}
                </S.FlagButton>
              );
            })}
          </S.FlagButtonBox>
        )}
      </S.FlagButtonContainer>
      {phoneCall.map((item, key) => {
        return (
          <S.PhoneInput
            value={item}
            key={key}
            onChange={(e) => onChangePhoneNumber(key, e)}
            active={phoneCall[key].length === 3}
          />
        );
      })}
    </S.Wrapper>
  );
}

const convertNumber = (number: string): string[] => {
  const noCountryNumber = number.replace(/\D/g, "");
  if (noCountryNumber.length === 11) {
    return [
      noCountryNumber.substring(0, 3),
      noCountryNumber.substring(3, 7),
      noCountryNumber.substring(7, 11),
    ];
  }
  throw new CustomException(400, "입력값 오류");
};

const convertToInternational = (numbers: string[], flag: Flag): string => {
  const phoneNumber = numbers.join();
  return flag.countryCode + phoneNumber;
};

export { PhoneNumber };
