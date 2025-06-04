import ReactLenis from "lenis/react";
import styled from "styled-components";

export const Wrapper = styled(ReactLenis)``;

export const MainSection = styled.section`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const Article = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const StarContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
`;

export const ModelContainer = styled.section`
  position: relative;
  width: 100%;
  height: 200vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const Hero = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AIIntroduction = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
