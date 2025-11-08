import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 40px 400px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 32px;
`;

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const Title = styled.span`
  font-family: "Prata-Regular";
  font-size: 40px;
  font-weight: 600;
  text-align: right;
  letter-spacing: -4px;
  margin: 0;
  background-image: linear-gradient(to right, #e9faff, #b8d2ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const SubTitle = styled.span`
  font-family: "Prata-Regular";
  font-size: 16px;
  font-weight: 600;
  text-align: right;
  letter-spacing: 2px;
  margin: 0;
  background-image: linear-gradient(to right, #e9faff, #b8d2ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Text = styled.span`
  font-family: "Prata-Regular";
  font-size: 16px;
  font-weight: 600;
  text-align: right;
  letter-spacing: 2px;
  margin: 0;
  background-image: linear-gradient(to right, #e9faff, #b8d2ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const GlassCardContainer = styled(NavLink)`
  width: 500px;
  height: 400px;
  box-sizing: border-box;
  padding: 2.5rem 1rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(26px);
  -webkit-backdrop-filter: blur(26px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 8px 4px rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: hidden;
  transition: 0.2s all ease-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    );
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.8),
      transparent,
      rgba(255, 255, 255, 0.3)
    );
  }

  &:hover {
    transform: translateY(-8px);
  }
`;

export const HomeButton = styled(NavLink)`
  width: 300px;
  height: 80px;
  border-radius: 1000px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 8px 4px rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: hidden;
  transition: 0.2s all ease-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    );
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.8),
      transparent,
      rgba(255, 255, 255, 0.3)
    );
  }

  &:hover {
    transform: translateY(-8px);
  }
`;
