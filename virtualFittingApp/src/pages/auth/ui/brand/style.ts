import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem 0;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  background-color: #fffafa;
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
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 10rem 3rem;
  width: 20rem;
  height: calc(100%-10rem);
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
`;

export const StepText = styled.span<{ step: number }>`
  font-size: 0.9rem;
  font-weight: 600;
  transition: 0.15s all ease;
  color: ${(props) => (props.step === 0 ? "black" : "#969696")};
`;
