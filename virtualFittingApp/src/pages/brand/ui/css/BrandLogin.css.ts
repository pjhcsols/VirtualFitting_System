import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const StarWrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
`;

export const LogoWrapper = styled.div`
  width: 50%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InfoWrapper = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;
