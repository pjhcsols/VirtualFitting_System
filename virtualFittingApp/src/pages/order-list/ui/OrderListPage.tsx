import React, { useState, useEffect } from "react";
import { Header } from "@/shared/components/header/ui/Header";
import Product_Order_List from "@/shared/components/product/product-order-list/Product_Order_List";
import { fetchOrderHistory } from "../api/order.action";
import Delivery from "@/shared/components/delivery/ui/Delivery";
import { OrderData } from "../types/order";

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

export default OrderListPage;
