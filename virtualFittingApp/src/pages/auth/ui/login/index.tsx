import * as S from "./style";

import { Basilium3DLogo, StarBackground } from "@/shared";
import { LoginForm } from "../../widgets/login";
import { Canvas } from "@react-three/fiber";

function LoginPage() {
  return (
    <S.Wrapper>
      <S.InfoContainer>
        <S.StarBackground>
          <Canvas>
            <StarBackground />
          </Canvas>
        </S.StarBackground>
        <S.LeftContainer>
          <S.ModelContainer>
            <Basilium3DLogo />
          </S.ModelContainer>
        </S.LeftContainer>
        <S.RightContainer>
          {/* <LoginForm /> */}
        </S.RightContainer>
      </S.InfoContainer>
    </S.Wrapper>
  );
}

export { LoginPage };
