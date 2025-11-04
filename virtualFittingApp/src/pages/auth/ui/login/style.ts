import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

export const StarBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  z-index: 0;
  background: radial-gradient(
    circle at 30% 30%,
    #292e49 0%,
    #536976 50%,
    #bbd2c5 100%
  );
`;

export const InfoContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

export const LeftContainer = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const RightContainer = styled.div`
  box-sizing: border-box;
  padding: 2rem;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const ModelContainer = styled.div`
  position: relative;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
