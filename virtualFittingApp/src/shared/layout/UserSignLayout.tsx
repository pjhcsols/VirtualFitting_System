import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { motion } from "motion/react";
import { AnimationProps } from "../constants";

function UserSignLayout() {
  return (
    <AnimationContainer>
      <Wrapper>
        <Outlet />
      </Wrapper>
    </AnimationContainer>
  );
}

function AnimationContainer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={AnimationProps.initial}
      animate={AnimationProps.enter}
      exit={AnimationProps.exit}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

const Wrapper = styled.main`
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(to bottom, #292e49, #536976);
  z-index: 10;
`;

export { UserSignLayout };
