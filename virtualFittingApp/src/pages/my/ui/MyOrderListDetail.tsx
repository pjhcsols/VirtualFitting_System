import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";
import { useParams } from "react-router-dom";

function MyOrderListDetail() {
    const {id} = useParams();
    
    return (
        <PageWrapper>
            <HeaderWrapper>
                <MyHeader title="주문 상세" />
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
  max-width: 600px;
  padding: 30px 30px;
  box-sizing: border-box;
`;