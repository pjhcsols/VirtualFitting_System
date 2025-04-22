import { useRive } from "@rive-app/react-canvas";
import styled from "styled-components";

function CheckMarkAnimation() {
  const { rive, RiveComponent } = useRive({
    src: "/rive/CheckMark.riv",
    stateMachines: "CheckMark",
    autoplay: true,
  });
  return (
    <Wrapper>
      <RiveComponent />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-content: center;
`;

export { CheckMarkAnimation };
