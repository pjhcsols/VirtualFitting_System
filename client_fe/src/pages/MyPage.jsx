import React, { useState, useEffect } from "react";
import Header_Bottom from "../components/Header_Bottom";
import Profile_Header from "../components/Profile_Header";
import Product_Order_List from "../components/Product_Order_List";
import axios from "axios";

const MyPage = () => {

    const [orderData, setOrderData] = useState([])

    useEffect(() =>{
        axios.get("http://localhost:8080/")
        .then(response =>{
            setOrderData(response.data);
        })
        .catch(error =>{
            console.log('Error fetching order data:', error);
        })
    }, [])

    return (
        <div>
            <Header_Bottom/>
            <Profile_Header/>
            <Product_Order_List orderData={orderData}/>
        </div>
    );
}

export default MyPage;
