import * as S from "@/pages/brand/ui/css/BrandLogin.css";
import { Basilium3DModelLogin, LoginInput } from "@/shared";
import { ChangeEvent, useRef, useState } from "react";
import { type BrandSigninUserType } from "@/pages/brand/types/brandUser";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

function BrandLogin() {
  const [brandUserInfo, setBrandUserInfo] = useState<BrandSigninUserType>({
    email: "",
    password: "",
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email" || name === "password") {
      setBrandUserInfo({
        ...brandUserInfo,
        [name]: value,
      });
    }
  };

  const RotatingStars = () => {
    const stars = useRef(null);

    useFrame(() => {
      if (stars.current) {
        stars.current.rotation.x = stars.current.rotation.y += 0.00015;
      }
    });

    return <Stars ref={stars} />;
  };

  return (
    <S.Wrapper>
      <S.StarWrapper>
        <Canvas>
          <OrbitControls />
          <RotatingStars />
        </Canvas>
      </S.StarWrapper>
      <S.LogoWrapper>
        <Basilium3DModelLogin />
      </S.LogoWrapper>
      <S.InfoWrapper>
        <LoginInput
          value={brandUserInfo.email}
          name="email"
          type={true}
          placeholder="Email"
          onChange={onChange}
        />
        <LoginInput
          value={brandUserInfo.password}
          name="password"
          type={false}
          placeholder="password"
          onChange={onChange}
        />
      </S.InfoWrapper>
    </S.Wrapper>
  );
}

export { BrandLogin };
