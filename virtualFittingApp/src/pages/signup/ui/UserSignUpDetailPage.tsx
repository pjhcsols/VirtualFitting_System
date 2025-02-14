import styled, { keyframes } from "styled-components";

function UserSignUpDetailPage() {
  return (
    <Wrapper>
      <InputContainer>
        <InputBox>
          <InputLabel>Title</InputLabel>
          <TextInput />
        </InputBox>
      </InputContainer>
    </Wrapper>
  );
}

const moveStars = keyframes`
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-50%, -50%);
  }
`;

const Wrapper = styled.div`
  margin: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #292e49, #536976);
  z-index: -1;
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, white 2%, transparent 2%) repeat;
    background-size: 2px 2px;
    animation: ${moveStars} 10s linear infinite;
  }
`;

const InputContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const InputBox = styled.div`
  width: 100%;
  gap: 8px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const InputLabel = styled.label`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;

const TextInput = styled.input`
  padding: 8px 18px;
  min-width: 320px;
  width: 80%;
  height: 24px;
  border-radius: 1000px;
`;

const StepButton = styled.button`
  width: 320px;
  height: 32px;
  border-radius: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { UserSignUpDetailPage };
