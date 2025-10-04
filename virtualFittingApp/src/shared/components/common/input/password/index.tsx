import { ChangeEvent, useState } from "react";
import * as S from "./style";
import { EyeIcon } from "lucide-react";

interface IPasswordInput {
  title: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function PasswordInput({ name, onChange, title, value }: IPasswordInput) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };
  return (
    <S.InfoBox>
      <S.InputContainer inputed={value.length !== 0}>
        <input
          type={showPassword ? "text" : "password"}
          id="input"
          name={name}
          value={value}
          onChange={onChange}
          required
        />
        <label htmlFor="input" className="label">
          {title}
        </label>
        <div className="underline" />
      </S.InputContainer>
      <S.ToggleButton
        type="button"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        <EyeIcon
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {showPassword ? (
            // 눈 감은 아이콘
            <>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z" />
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.93-6.93a2.99 2.99 0 0 0-4.17-.11L9.9 4.24z" />
            </>
          ) : (
            // 눈 뜬 아이콘
            <>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </EyeIcon>
      </S.ToggleButton>
    </S.InfoBox>
  );
}

export { PasswordInput };
