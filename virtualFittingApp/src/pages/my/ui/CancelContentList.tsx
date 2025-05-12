import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { OrderItem } from "../types/order";
import { orderDummyData } from "@/pages/my/constants/dummy/dummyData";
import { formatSimpleDate } from "@/shared";
import alertImg from "@/pages/my/ui/alert.png";

function CancelContentList() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>("전체");
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    };

    useEffect(() => {
        setOrders(orderDummyData);
    }, []);
    
    useEffect(() => {
        if (activeTab === "전체") {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(
                orders.filter((order) => order.category === activeTab)
            );
        }
    }, [activeTab, orders]);

    if (!filteredOrders.length) {
        return (
        <EmptyWrapper>
            <AlertImage src={alertImg} alt="알림 아이콘" />
            <Message>구매하신 상품이 없습니다.</Message>
        </EmptyWrapper>
        );
    } 

    return (
        <>
            <TabWrapper>
                {["전체", "취소/반품", "교환"].map((tab) => (
                <TabText
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    active={activeTab === tab}
                >
                    {tab}
                </TabText>
                ))}
            </TabWrapper>
  
            {filteredOrders.map((order) => (
                 <React.Fragment key={order.id}>
                   <DateText>{formatSimpleDate(order.date)}</DateText>
                   <CateogryText>{order.category} 요청</CateogryText>
                   <OrderCard>
                     <ImageBox src={order.productImageUrl || alertImg} alt="상품 이미지"/>
                     <RightSection>
                       <TitleLine>
                         <Brand>{order.brand}</Brand>
                         <OrderDetail>
                           주문 상세
                         </OrderDetail>
                       </TitleLine>
                       <ProductName>{order.productName}</ProductName>
                       <OptionText>
                         {order.options.color} / {order.options.size} / {order.options.quantity}개
                       </OptionText>
                       <Price>{order.price.toLocaleString()}원</Price>
                     </RightSection>
                   </OrderCard>
                   
                   <ButtonWrapper>
                        {order.category === "교환" ? (
                            <>
                                <ActionButton>교환 상세</ActionButton>
                                <ActionButton>교환 배송 조회</ActionButton>
                                <ActionButton>회수 배송 조회</ActionButton>
                            </>
                        ) : (
                            <>
                                <ActionButton>A</ActionButton>
                                <ActionButton>B</ActionButton>
                                <ActionButton>C</ActionButton>
                            </>
                        )}
                    </ButtonWrapper>

                   <Divider />
                 </React.Fragment>
            ))}
        </>
    );
}

export default CancelContentList;

const TabWrapper = styled.div`
    display: flex;
    justify-content: left;
    gap: 24px;
    top: 70.5px;
    background: #fff;
    white-space: nowrap;
    max-width: 100%;
    margin-bottom: 30px;
    position: sticky;
    padding: 10px 0;
    background-color: #fff;
    overflow: hidden;
`;

const TabText = styled.span<{ active: boolean }>`
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  color: ${(props) => (props.active ? "#000" : "#969696")};
  cursor: pointer;
  position: relative;
  padding-bottom: 4px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${(props) => (props.active ? "100%" : "0")};
    height: 2px;
    background-color: #000;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #000;
  }
`;

const DateText = styled.p`
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 12px;
  text-align: left;
`;

const CateogryText = styled.p`
    font-size: 15px;
    color: #333333;
    text-align: left;
`

const OrderCard = styled.div`   
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  width: 550px;
`;

const ImageBox = styled.img<{src?:string}>`
  width: 100px;
  height: 110px;
  background-color: #d9d9d9;
  border-radius: 10px;
  object-fit: cover;
  background-position: center;
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
    margin-bottom: 20px;
    color: #d9d9d9;
`