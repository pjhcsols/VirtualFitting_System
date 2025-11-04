import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem 10rem;
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  @media (max-width: 1024px) {
    padding: 1rem 5rem;
  }
  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;

export const ButtonContainer = styled.div`
  box-sizing: border-box;
  padding: 0.5rem 8rem;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

export const CancelButton = styled(NavLink)`
  min-width: 30rem;
  height: 2.5rem;
  border-radius: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
  border: 1px solid #d9d9d9;
`;

export const NextButton = styled.button`
  min-width: 30rem;
  height: 2.5rem;
  border-radius: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
  border: 1px solid black;
`;

export const StepInformation = styled.section`
  width: 50%;
  height: calc(100%-10rem);
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const StepText = styled.span<{ step: number }>`
  font-size: 0.9rem;
  font-weight: 600;
  transition: 0.15s all ease;
  color: ${(props) => (props.step === 0 ? "black" : "#969696")};
`;

export const ContentCardContainer = styled.div`
  width: 50%;
  max-height: 90vh;

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
  overflow-y: scroll;

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
  @media (max-width: 768px) {
    width: 100%;
  }
`;
