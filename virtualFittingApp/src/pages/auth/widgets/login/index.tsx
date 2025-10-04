import {
  AuthLoginButton,
  AuthSignUpButton,
  PasswordInput,
  TextInput,
} from "@/shared";
import * as S from "./style";
import { useLogin } from "../../hooks/useLogin";

function LoginForm() {
  const { user, errMsg, onChange, onSubmit } = useLogin();
  return (
    <S.Wrapper>
      <S.Title>BASILIUM</S.Title>
      <S.InfoContainer>
        <TextInput
          name="userId"
          onChange={onChange}
          title="ID"
          type="text"
          value={user.userId}
        />
        <PasswordInput
          name="userPassword"
          value={user.userPassword}
          onChange={onChange}
          title="Password"
        />
      </S.InfoContainer>
      <S.Divider />
      <S.ButtonContainer>
        <AuthLoginButton />
        <AuthSignUpButton />
      </S.ButtonContainer>
    </S.Wrapper>
  );
}

export { LoginForm };
