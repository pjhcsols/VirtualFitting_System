import styled from "styled-components";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export const Wrapper = styled.div`
  margin: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LogoContainer = styled.div`
  padding: 40px 100px;
  width: 50%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

export const LogoTitle = styled(motion.h1)`
  font-size: 2em;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
`;

export const InputContainer = styled.div`
  padding: 40px 100px;
  width: 50%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

export const InputBox = styled.div`
  width: 100%;
  gap: 8px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const InputLabel = styled.label`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

export const TextInput = styled.input`
  padding: 8px 18px;
  min-width: 320px;
  width: 80%;
  height: 24px;
  border-radius: 1000px;
  background: white;
  color: black;
`;

export const StepButton = styled(Link)`
  min-width: 320px;
  width: 80%;
  height: 36px;
  border-radius: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: gray;
  color: white;
  transition: 0.15s all ease-out;
`;
