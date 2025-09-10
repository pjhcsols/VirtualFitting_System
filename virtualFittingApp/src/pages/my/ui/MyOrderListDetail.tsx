import styled from "styled-components";
import { useParams } from "react-router-dom";
import { BREAKPOINTS } from "@/shared";
import { OrderDetailContent } from "@/pages/my/ui/OrderDetailContent";

function MyOrderListDetail() {
    const {id} = useParams();
    
    return (
        <PageWrapper>
            <OrderDetailContent />
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
  flex: 1;
  min-height: auto; 
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