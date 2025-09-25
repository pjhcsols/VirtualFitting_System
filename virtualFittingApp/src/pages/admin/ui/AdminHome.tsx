import styled from "styled-components";
import { BannerViewer } from "../widgets/carousel/BannerViewer";

function AdminHome() {
  return (
    <Wrapper>
      <BannerContainer>
        <BannerViewer />
      </BannerContainer>
    </Wrapper>
  );
}

export { AdminHome };

const Wrapper = styled.main`
  box-sizing: border-box;
  padding: 0 10rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const BannerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;
