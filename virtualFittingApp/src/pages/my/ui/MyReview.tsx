import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";

function MyReview() {
    
    return (
        <PageWrapper>
            <HeaderWrapper>
                <MyHeader title="후기 작성" />
            </HeaderWrapper>

            <ContentWrapper>
                <InnerContent>
                </InnerContent>
            </ContentWrapper>
        </PageWrapper>
    );
}

export { MyReview };


const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100vh;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const ContentWrapper = styled.div`
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const InnerContent = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 30px 30px;
  box-sizing: border-box;
`;