import React from "react";
import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";
import { useNavigate } from "react-router-dom";

function MyCancel() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <HeaderWrapper>
        <MyHeader title="취소/반품/교환 내역" />
      </HeaderWrapper>

      <ContentWrapper>
        <InnerContent>
          <DateText>2025.01.20</DateText>

          <OrderCard>
            <ImageBox />

            <RightSection>
              <TitleLine>
                <Brand>BASILIUM</Brand>
                <OrderDetail onClick={() => navigate("myPage/order/detail")}>주문 상세</OrderDetail>
              </TitleLine>
              <ProductName>클래식 B 루즈핏 티셔츠</ProductName>
              <OptionText>블랙 / XL / 1개</OptionText>
              <Price>42000</Price>
            </RightSection>

          </OrderCard>

          <ButtonWrapper> 
            <ActionButton>A</ActionButton>
            <ActionButton>B</ActionButton>
            <ActionButton>C</ActionButton>
          </ButtonWrapper>

          <Divider />
        </InnerContent>
      </ContentWrapper>
    </PageWrapper>
  );
}

export { MyCancel };

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

const DateText = styled.p`
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 12px;
  margin-right: 500px;
`;

const OrderCard = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  width: 550px;
`;

const ImageBox = styled.div`
  width: 100px;
  height: 110px;
  background-color: #d9d9d9;
  border-radius: 10px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Brand = styled.div`
  font-weight: bold;
  font-size: 14px;
`;

const OrderDetail = styled.div`
  font-size: 12px;
  color: #888;
  text-decoration: underline;
  cursor: pointer;  
  margin-right: 8px;
`;

const ProductName = styled.div`
  font-size: 14px;
  margin-top: 15px;
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 12px;
  color: rgb(150, 150, 150);
  text-align: left;
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-top: 4px;
  text-align: left;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: flex-start;
`;

const ActionButton = styled.button`
  width: 200px;
  height: 40px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  font-size: 14px;
  cursor: pointer;
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  height: 1px;
  background-color: #e5e5e5;
  width: 540px;
`;