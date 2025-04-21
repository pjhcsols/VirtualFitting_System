import styled from "styled-components";

type ProgressType = {
  step: number;
};

function ProgressBar({ step }: ProgressType) {
  return (
    <Wrapper>
      <StepCircle></StepCircle>
    </Wrapper>
  );
}

export { ProgressBar };

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StepCircle = styled.div`
  width: 5vw;
  height: 5vw;
  border-radius: 100%;
  border: 1px solid black;
`;
