import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import type { ReviewData } from "../types/review";
import type { OrderItemWithReview } from "../types/orderWithReview";
import { orderDummyData } from "@/pages/my/constants/dummy/dummyData";
import { formatSimpleDate } from "@/shared";
import alertImg from "@/pages/my/ui/alert.png";
import { ReviewCard } from "@/widgets";
import { BREAKPOINTS } from "@/shared";
import { getReviewAPI } from "../api/get.action";


function ReviewContentList() {
    const navigate = useNavigate(); 
    const [activeTab, setActiveTab] = useState<string>("작성가능");
    const [orders, setOrders] = useState<OrderItemWithReview[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderItemWithReview[]>([]);

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    };

    useEffect(() => {
      const dummyOrders = orderDummyData;
      const savedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");

      const updatedOrders = dummyOrders.map(order => {
        const matchedReview = savedReviews.find((review: ReviewData) => review.id === order.id);
          return {
            ...order,
            isReviewed: matchedReview ? true : false,
            reviewData: matchedReview || null
          };
      });

      setOrders(updatedOrders);
    }, []);

    
    useEffect(() => {
        if (activeTab === "작성가능") {
            setFilteredOrders(orders.filter((order) => !order.isReviewed));
        } else if (activeTab === "작성완료") {
            setFilteredOrders(orders.filter((order) => order.isReviewed));
        } else {
            setFilteredOrders(orders);
        }
    }, [activeTab, orders]);;

    const handleDeleteReview = (id: string) => {
      const savedReviews: ReviewData[] = JSON.parse(localStorage.getItem("reviews") || "[]");
      const updatedReviews = savedReviews.filter((review) => review.id !== id);
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
      window.location.reload(); 
    };


  return (
    <OuterWrapper>
      <StickyTabWrapper>
        <TabInner>
          {["작성가능", "작성완료"].map((tab) => (
            <TabText
              key={tab}
              onClick={() => handleTabClick(tab)}
              active={activeTab === tab}
            >
              {tab}
            </TabText>
          ))}
        </TabInner>
      </StickyTabWrapper>

      <ContentWrapper>
        {filteredOrders.length === 0 ? (
          <EmptyWrapper>
            <AlertImage src={alertImg} alt="알림 아이콘" />
            <Message>
              {activeTab === "작성완료"
                ? "작성완료한 리뷰가 없습니다."
                : "리뷰가능한 상품이 없습니다."}
            </Message>
          </EmptyWrapper>
        ) : (
          filteredOrders.map((order) => (
            <React.Fragment key={order.id}>
              {activeTab === "작성완료" ? (
                order.reviewData && (
                  <ReviewCard order={order} reviewData={order.reviewData} onDelete={handleDeleteReview} />
                )
              ) : (
                <>
                  <OrderCard>
                    <ImageBox src={order.productImageUrl || alertImg} alt="상품 이미지" />
                    <RightSection>
                      <TitleLine>
                        <Brand>{order.brand}</Brand>
                      </TitleLine>
                      <ProductName>{order.productName}</ProductName>
                      <OptionText>
                        {order.options.color} / {order.options.size} / {order.options.quantity}개 |{" "}
                        {formatSimpleDate(order.date)} 구매
                      </OptionText>
                    </RightSection>
                  </OrderCard>

                  <ButtonWrapper>
                    <ActionButton onClick={() => navigate(`/myPage/review/${order.id}`)}>
                      스타일 리뷰
                    </ActionButton>
                  </ButtonWrapper>
                </>
              )}
              <Divider />
            </React.Fragment>
          ))
        )}
      </ContentWrapper>
    </OuterWrapper>
  );
}

export { ReviewContentList };

const OuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StickyTabWrapper = styled.div`
  position: sticky;
  top: 81px;
  z-index: 100;
  width: 100%;
  background-color: white;
`;

const TabInner = styled.div`
  display: flex;
  gap: 24px;
  max-width: 800px;
  width: 100%;
  padding: 10px 0;
  margin: 0 auto;
  border-bottom: 1px solid #eee;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 10px 16px;
    max-width: 100%;
  }
`;

const TabText = styled.span<{ active: boolean }>`
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  color: ${(props) => (props.active ? "#000" : "#969696")};
  cursor: pointer;
  font-family: "Prata-Regular";
  position: relative;
  padding-bottom: 4px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${(props) => (props.active ? "100%" : "0")};
    height: 2px;
    background-color: #000;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #000;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 30px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 0 16px;
    max-width: 100%;
  }
`;

const OrderCard = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  width: 100%;
`;

const ImageBox = styled.img`
  width: 100px;
  height: 110px;
  background-color: #d9d9d9;
  border-radius: 10px;
  object-fit: cover;
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
  font-family: "Prata-Regular";
  font-size: 14px;
`;

const ProductName = styled.div`
  font-size: 14px;
  font-family: "Prata-Regular";
  margin-top: 15px;
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: #969696;
  text-align: left;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const ActionButton = styled.button`
  flex: 1 1 200px;
  min-width: 120px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  font-size: 14px;
  font-family: "Prata-Regular";
  cursor: pointer;
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  height: 1px;
  background-color: #e5e5e5;
  width: 100%;
`;

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
`;

const AlertImage = styled.img`
  width: 80px;
  height: 80px;
`;

const Message = styled.p`
  font-size: 20px;
  font-family: "Prata-Regular";
  margin-bottom: 20px;
  color: #d9d9d9;
`;