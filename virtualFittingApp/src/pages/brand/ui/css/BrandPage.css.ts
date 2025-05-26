import ReactLenis from "lenis/react";
import styled from "styled-components";

export const LenisWrapper = styled(ReactLenis)``;

export const Wrapper = styled.main`
  position: relative;
  box-sizing: border-box;
  max-width: 100vw;
  min-height: 100vh;
  background-color: #fffafa;
`;

export const Container = styled.div`
  box-sizing: border-box;
  padding: 0 140px;
  width: 100%;
  min-height: 100vh;
  transition: 0.3s padding ease-out;
  background: linear-gradient(to bottom, #292e49, #536976 50%, #bbd2c5 100%);
  @media (max-width: 1024px) {
    padding: 0 100px;
  }
  @media (max-width: 748px) {
    padding: 0 80px;
  }
  @media (max-width: 688px) {
    padding: 0 40px;
  }
`;

export const HeroContainer = styled.section`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 140px 0;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  @media (max-width: 1284px) {
    padding: 120px 0;
  }
  @media (max-width: 1080px) {
    padding: 100px 0;
  }
  @media (max-width: 784px) {
    padding: 80px 0;
  }
  @media (max-width: 640px) {
    padding: 40px 0;
  }
`;

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 32px;
`;

export const Title = styled.span`
  font-family: "Prata-Regular";
  font-size: 1.25rem;
  color: white;
`;

export const Carpet = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50vh;
  display: flex;
  border-radius: 100%;
  box-shadow: 0px 16px 16px 4px #323b53;
  justify-content: center;
  align-content: center;
  background: radial-gradient(circle, #50586b 0%, #323b53 100%);
`;

export const DescSection = styled(HeroContainer)`
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 64px;
`;

export const DescTitle = styled.span`
  font-family: "Prata-Regular";
  font-size: 2rem;
  color: white;
`;

export const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AIWearingContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TextureContainer = styled.div`
  width: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-content: center;
  gap: 64px;
`;

export const DescText = styled(DescTitle)`
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-weight: 500;
  color: white;
`;

export const InterfaceDescSection = styled(DescSection)``;

export const BasiliumDescSection = styled(HeroContainer)`
  justify-content: center;
  align-items: center;
`;

export const BasiliumLogoContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BasiliumTextureContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

export const BasiliumLogoText = styled.span`
  font-family: "Prata-Regular";
  font-size: 2rem;
  color: white;
  text-transform: uppercase;
`;
