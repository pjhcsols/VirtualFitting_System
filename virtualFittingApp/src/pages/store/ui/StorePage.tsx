import styled from "styled-components";
import { Banner } from "../../../widgets";

function StorePage() {
  return (
    <Wrapper>
      <BannerContainer>
        <Banner />
      </BannerContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const BannerContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

export { StorePage };
