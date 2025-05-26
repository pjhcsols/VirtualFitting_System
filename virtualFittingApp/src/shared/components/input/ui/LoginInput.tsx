import * as S from "@/shared/components/input/ui/css/LoginInput.css";
import { ChangeEvent } from "react";

type LoginInputType = {
  value: string;
  name: string;
  type: boolean;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function LoginInput({
  value,
  name,
  type,
  placeholder,
  onChange,
}: LoginInputType) {
  return (
    <S.InputBox>
      <S.Input
        type={type ? "text" : "password"}
        value={value}
        name={name}
        onChange={(e) => onChange(e)}
        required
      />
      <S.Title>{placeholder}</S.Title>
    </S.InputBox>
  );
}

export { LoginInput };
