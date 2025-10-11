import { PasswordInput, TextInput } from "@/shared";
import * as S from "./style";
import { useLogin } from "../../hooks/useLogin";

function LoginForm() {
  const { user, onChange, onSubmit } = useLogin();
  return (
    <S.Wrapper onSubmit={onSubmit}>
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
      <S.ButtonContainer>
        <S.LoginButtonWrapper>
          <S.ButtonText>로그인</S.ButtonText>
        </S.LoginButtonWrapper>
        <S.SignUpButtonWrapper to={"/signup"}>
          <S.SignUpText>회원가입</S.SignUpText>
        </S.SignUpButtonWrapper>
      </S.ButtonContainer>
    </S.Wrapper>
  );
}

export { LoginForm };
