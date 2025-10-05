import type { ChangeEvent } from "react";
import * as S from "./style";

interface ITextInput {
  type: "email" | "text" | "password";
  title: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function TextInput({ name, onChange, title, type, value }: ITextInput) {
  return (
    <S.InputContainer inputed={value.length !== 0}>
      <input
        type={type}
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
  );
}

export { TextInput };
