import React, { useState, useEffect, useRef } from "react";
import HeaderBottom from "../components/Header_Bottom";
import ProfileHeader from "../components/Profile_Header";
import ProductOrderList from "../components/Product_Order_List";
import ShoppingCart from "../components/ShoppingCart";
import LikeList from "../components/Like_List";
import axios from "axios";
import { useLocation } from "react-router-dom";

const MyPage = () => {
    const [orderData, setOrderData] = useState([])
    const [userData, setUserData] = useState([])
    const [shoppingData, setShoppingData] = useState([])
    const [likeData, setLikeData] = useState([])

    const shoppingCartRef = useRef(null);
    const location = useLocation();

    useEffect(() =>{
        const jwtToken = localStorage.getItem("login-token");

        const config = {
            headers: {
                Authorization: `Bearer ${jwtToken}` // Authorization 헤더에 JWT 포함
            }
        };

        axios.get("http://155.230.43.12:8090/normalUser/userInfo", config)
        .then(response =>{
            setUserData(response.data);
            console.log("1번--------------")
            console.log(response.data);
            console.log("1번--------------")
        })
        .catch(error =>{
            console.log('Error fetching user data:', error);
        })

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

        axios.get("http://155.230.43.12:8090/normalUser/shopping/list", config)
        .then(response =>{
            setShoppingData(response.data);
            console.log("3번--------------")
            console.log(response.data);
            console.log("3번--------------")
        })
        .catch(error =>{
            console.log('Error fetching order data:', error);
        })

        axios.get("http://155.230.43.12:8090/normalUser/like/list", config)
        .then(response =>{
            setLikeData(response.data);
            console.log("4번--------------")
            console.log(response.data);
            console.log("4번--------------")
        })
        .catch(error =>{
            console.log('Error fetching order data:', error);
        })

        const params = new URLSearchParams(location.search);
        const section = params.get('section');

        if (section === 'shoppingCart') {
            shoppingCartRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.search]);

    return (
        <div>
            <HeaderBottom/>
            <ProfileHeader userData={userData}/>
            <ProductOrderList orderData={orderData}/>
            <div ref={shoppingCartRef}>
                <ShoppingCart shoppingData={shoppingData} />
            </div>
            <LikeList likeData={likeData} />
        </div>
    );
}

export default MyPage;
