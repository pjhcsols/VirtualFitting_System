import { PasswordInput, TextInput } from "@/shared";
import * as S from "./style";
import { useLoginWidget } from "@/widgets/auth/hooks/useLoginWidget";

function LoginForm() {
  const { loginInfo, onChangeUserId, onChangeUserPassword, onSubmitLoginInfo } =
    useLoginWidget();
  return (
    <S.Wrapper>
      <S.Title>BASILIUM</S.Title>
      <S.InfoContainer>
        <TextInput
          name="userId"
          onChange={onChangeUserId}
          title="ID"
          type="text"
          value={loginInfo.userId}
        />
        <PasswordInput
          name="userPassword"
          value={loginInfo.userPassword}
          onChange={onChangeUserPassword}
          title="Password"
        />
      </S.InfoContainer>
      <S.ButtonContainer>
        <S.LoginButtonWrapper onClick={onSubmitLoginInfo}>
          <S.ButtonText>로그인</S.ButtonText>
        </S.LoginButtonWrapper>
        <S.SignUpButtonWrapper to={"/service"}>
          <S.SignUpText>회원가입</S.SignUpText>
        </S.SignUpButtonWrapper>
      </S.ButtonContainer>
    </S.Wrapper>
  );
}

export { LoginForm };
