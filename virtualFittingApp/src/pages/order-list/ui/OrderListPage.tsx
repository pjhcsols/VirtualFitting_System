import { useState, useEffect } from "react";
import styled from "styled-components";
import { OrderData } from "@/shared";
import { ProductOrderList } from "@/shared";
import { BREAKPOINTS } from "@/shared";
import { dummy } from "../constants"; //일단은 더미 넣어둬서 나중에 수정해야함ㅜ,,

const OrderListPage = () => {
  // const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [orderData] = useState<OrderData[]>(dummy);

  return (
    <Wrapper>
      <ProductOrderList orderData={orderData} isOrderListPage={true} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-height: 420px;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;  
`;

export { OrderListPage };
