import { NormalUserSignUp } from "@/widgets";
import styled from "styled-components";

function NormalSignUpPage() {
  return (
    <Wrapper>
      <NormalUserSignUp />
    </Wrapper>
  );
}

export { NormalSignUpPage };

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  background-color: #fffafa;
`;
