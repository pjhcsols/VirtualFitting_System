import { type NormalUserType } from "@/entities/auth/types/normal.d";
import * as S from "./style";
import { TextInput } from "@/shared";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface INormalUserSignUpWidget {
  data: NormalUserType;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  birthday: Dayjs | null;
  setBirthday: Dispatch<SetStateAction<Dayjs | null>>;
}

function NormalUserSecondWidget({
  data,
  onChange,
  birthday,
  setBirthday,
}: INormalUserSignUpWidget) {
  return (
    <S.Wrapper>
      <S.InfoContainer>
        <S.TitleContainer>
          <S.Title>BRAND 회원가입</S.Title>
        </S.TitleContainer>
        <S.InfoBox>
          <TextInput
            name="emailAddress"
            title="EMAIL"
            type="text"
            value={data.emailAddress}
            onChange={onChange}
          />
        </S.InfoBox>
        <S.InfoBox>
          <S.SubTitle>성별</S.SubTitle>
          <S.GenderContainer>
            <div
              className={`w-40 h-16 rounded-md border flex justify-center items-center hover:bg-white duration-200 ${data.gender === "MALE" ? "bg-gray-100" : "bg-transparent"}`}
            >
              <S.Text>MALE</S.Text>
            </div>
            <div
              className={`w-40 h-16 rounded-md border flex justify-center items-center hover:bg-white duration-200 ${data.gender === "FEMALE" ? "bg-gray-100" : "bg-transparent"}`}
            >
              <S.Text>FEMALE</S.Text>
            </div>
          </S.GenderContainer>
        </S.InfoBox>
        <S.InfoBox>
          <TextInput
            name="address"
            title="Address"
            type="text"
            value={data.address}
            onChange={onChange}
          />
        </S.InfoBox>
        <S.InfoBox>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Basic date picker"
              value={birthday}
              onChange={(value) => setBirthday(value)}
            />
          </LocalizationProvider>
        </S.InfoBox>
      </S.InfoContainer>
    </S.Wrapper>
  );
}

export { NormalUserSecondWidget };
