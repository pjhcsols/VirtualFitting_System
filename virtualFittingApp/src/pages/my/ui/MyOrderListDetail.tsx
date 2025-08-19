import styled from "styled-components";
import { Header } from "@/shared";
import { useParams } from "react-router-dom";
import { BREAKPOINTS } from "@/shared";

function MyOrderListDetail() {
    const {id} = useParams();
    
    return (
        <PageWrapper>
            <HeaderWrapper>
                <Header />
            </HeaderWrapper>

            <ContentWrapper>
                <InnerContent>
                </InnerContent>
            </ContentWrapper>
        </PageWrapper>
    );
}

export { MyOrderListDetail };


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
  max-width: 800px;
  padding: 30px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 20px 16px;
    max-width: 100%;
  }
`;