import React from "react";
import styled from "styled-components";
import { OrderItem } from "@/pages/my/types/order";
import alertImg from "@/pages/my/ui/alert.png";
import { formatSimpleDate } from "@/shared";

type ReviewCardProps = {
  order: OrderItem;
};

const ReviewCard = ({ order }: ReviewCardProps) => {
  return (
    <CardWrapper>
      <Header>
        <StatusText>일반 후기</StatusText>
        <ApprovalBadge>승인</ApprovalBadge>
      </Header>

      <Rating>
        <DateText>{formatSimpleDate(order.date)}</DateText>
      </Rating>

      <ProductInfo>
        <ProductImg src={order.productImageUrl || alertImg} />
        <Details>
          <Brand>{order.brand}</Brand>
          <ProductName>{order.productName}  {order.options.color}</ProductName>
          <OptionText>
            {order.options.size} 구매
          </OptionText>
        </Details>
      </ProductInfo>

      <ReviewText>
        색깔도 딱 마음에 들고 착용감이 너무 편해요. 
      </ReviewText>
    </CardWrapper>
  );
};

export { ReviewCard };


const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 550px;
  align-items: flex-start;
`;

const Header = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  text-align: left;
`;

const StatusText = styled.span`
  font-weight: bold;
`;

const ApprovalBadge = styled.span`
  font-size: 12px;
  background-color: #007bff;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
`;

const Rating = styled.div`
  font-size: 13px;
  color: #777;
  width: 100%;
  text-align: left;
`;

const DateText = styled.span``;

const ProductInfo = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const ProductImg = styled.img`
  width: 60px;
  height: 70px;
  background-color: #d9d9d9;
  border-radius: 10px;
  object-fit: cover;
  background-position: center;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const Brand = styled.div`
  font-weight: bold;
  font-size: 14px;
  text-align: left;
`;

const ProductName = styled.div`
  font-size: 13px;
  margin-top: 4px;
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 12px;
  color: #999;
  text-align: left;
`;

const ReviewText = styled.p`
  font-size: 14px;
  line-height: 1.4;
  width: 100%;
  text-align: left;
`;
