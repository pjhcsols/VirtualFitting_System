import * as S from "./style";

import { Basilium3DLogo, StarBackground } from "@/shared";
import { LoginForm } from "@/widgets";
import { useLogin } from "@/pages/auth/hooks/useLogin";

function LoginPage() {
  const { user, errMsg, onChange, onSubmit } = useLogin();
  return (
    <S.Wrapper>
      <S.InfoContainer>
        <StarBackground />
        <S.LeftContainer>
          <S.ModelContainer>
            <Basilium3DLogo />
          </S.ModelContainer>
        </S.LeftContainer>
        <S.RightContainer>
          <LoginForm />
        </S.RightContainer>
      </S.InfoContainer>
    </S.Wrapper>
  );
}

export { LoginPage };
