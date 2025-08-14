import styled from "styled-components";
import { PNG_HOODIE } from "@/shared";

function AiServiceSection() {
  return (
    <Wrapper>
      <GlassCard>
        <HoodieImg src={PNG_HOODIE} alt="Hoodie" />
      </GlassCard>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GlassCard = styled.div`
  width: 960px;
  height: 640px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  position: relative;
`;

const HoodieImg = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: auto;
`;

export { AiServiceSection };