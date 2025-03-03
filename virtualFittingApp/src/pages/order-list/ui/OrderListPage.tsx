import { useState, useEffect } from "react";
import { fetchOrderHistory } from "@/pages/order-list/api/order.action";
import { OrderData } from "@/pages/order-list/types/order";

// * Shared Layer
import { Header, Product_Order_List, Delivery } from "@/shared";

const OrderListPage = () => {
  const [orderData, setOrderData] = useState<OrderData[]>([]);

  useEffect(() => {
    fetchOrderHistory()
      .then((response) => {
        setOrderData(response.data);
        console.log("2번--------------");
        console.log(response.data);
        console.log("2번--------------");
      })
      .catch((error) => {
        console.log("Error fetching order data:", error);
      });
  }, []);

  return (
    <div>
      <Header />
      <Product_Order_List orderData={orderData} isOrderListPage={true} />
      <Delivery />
    </div>
  );
};

export { OrderListPage };
