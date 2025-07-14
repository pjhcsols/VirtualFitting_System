import { SignupPanel } from "@/widgets";
import styled from "styled-components";

function SignupPage() {
  return (
    <Wrapper>
      <SignupPanel />
    </Wrapper>
  );
}

export { SignupPage };

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fffafa;
`;
