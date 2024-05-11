import React, { useState, useEffect } from "react";
import "./Delivery.css";
import axios from "axios";
const Delivery = () => {
    
    const [userData, setUserData] = useState(null);

    useEffect(() =>{
        const jwtToken = localStorage.getItem("login-token");

        const config = {
            headers: {
                Authorization: `Bearer ${jwtToken}` // Authorization 헤더에 JWT 포함
            }
        };
        axios.get("http://localhost:8080/normalUser/user/detail", config)
        .then(response =>{
            setUserData(response.data);
        })
        .catch(error =>{
            console.log('Error fetching user data:', error);
        })
    }, [])
    return (
        <div>
        <div className="shopping_list_container">
            <div className="header_div">
                <h2 className="shopping_list_title">배송지 정보</h2>
            </div>
                <table className="shopping_list_table">
                    <tbody>
                    <tr>
                            <td>
                                기본 배송지
                            </td>
                            <td>{userData ? userData.deliveryInfo.defaultDeliveryAddress : '없음' }</td>
                        </tr>
                        <tr>
                            <td>
                                배송지 1
                            </td>
                            <td>{userData ? userData.deliveryInfo.firstDeliveryAddress : '없음' }</td>
                        </tr>
                        <tr>
                            <td>
                                배송지 2
                            </td>
                            <td>{userData ? userData.deliveryInfo.second_delivery_address : '없음' }</td>
                        </tr>
                        
                    </tbody>
                </table>
            
        </div>

       
        </div>
    
    );
}

export default Delivery;
