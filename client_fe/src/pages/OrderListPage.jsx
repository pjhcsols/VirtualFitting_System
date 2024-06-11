import React, { useState, useEffect } from "react";
import Header_Bottom from "../components/Header_Bottom";
import Product_Order_List from "../components/Product_Order_List";
import axios from "axios";
import Delivery from "../components/Delivery";

const OrderListPage = () => {

    const [orderData, setOrderData] = useState([])

    useEffect(() =>{
        const jwtToken = localStorage.getItem("login-token");

        const config = {
            headers: {
                Authorization: `Bearer ${jwtToken}` // Authorization 헤더에 JWT 포함
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
            <Header_Bottom />
            <Product_Order_List orderData={orderData} isOrderListPage={true}/>
            <Delivery />
        </div>
    );
}

export default OrderListPage;