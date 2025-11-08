import { Outlet } from "react-router-dom";
import styled from "styled-components";

function SignUpLayout() {
  return (
    <Wrapper>
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </Wrapper>
  );
}

export { SignUpLayout };

const Wrapper = styled.main`
  position: relative;
  box-sizing: border-box;
  max-width: 100vw;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  transition: 0.3s padding ease-out;
  background: radial-gradient(
    circle at 15% 25%,
    #292e49 0%,
    #536976 60%,
    #bbd2c5 100%
  );
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
`;
