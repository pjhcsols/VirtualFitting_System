import { BrandUserSignUp } from "@/widgets";
import styled from "styled-components";

function BrandSignUpPage() {
  return (
    <Wrapper>
      <BrandUserSignUp />
    </Wrapper>
  );
}

export { BrandSignUpPage };

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
