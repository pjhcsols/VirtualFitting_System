import React, { useState, useEffect } from "react";
import HeaderBottom from "@/shared/components/header/header-bottom/HeaderBottom";
import Product_Order_List from "@/shared/components/product/product-order-list/Product_Order_List";
import axios from "axios";
import Delivery from "@/shared/components/delivery/ui/Delivery";

const OrderListPage = () => {

    const [orderData, setOrderData] = useState([])

    useEffect(() =>{
        const jwtToken = localStorage.getItem("login-token");

        const config = {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        };

        axios.get("http://155.230.43.12:8090/normalUser/order/history", config)
        .then(response =>{
            setOrderData(response.data);
            console.log("2번--------------")
            console.log(response.data);
            console.log("2번--------------")
        })
        .catch(error =>{
            console.log('Error fetching order data:', error);
        })
    }, [])

    return (
        <div>
            <HeaderBottom />
            <Product_Order_List orderData={orderData} isOrderListPage={true}/>
            <Delivery />
        </div>
    );
}

export default OrderListPage;