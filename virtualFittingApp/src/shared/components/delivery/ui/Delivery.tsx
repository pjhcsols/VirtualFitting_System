import React, { useState, useEffect } from "react";
import "./Delivery.css";
import { fetchUserData } from "../api/fetchUser.action";
import { UserData } from "../types/delivery";

const Delivery = () => {
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        const jwtToken = localStorage.getItem("login-token");

        if (jwtToken) {
            fetchUserData(jwtToken)
                .then((data) => {
                    setUserData(data);
                })
                .catch((error) => {
                    console.log("Error fetching user data:", error);
                });
        } else {
            console.log("No JWT token found");
        }
    }, []);

    return (
        <div className="shopping_list_container">
            <div className="header_div">
                <h2 className="shopping_list_title">배송지 정보</h2>
            </div>
            <table className="shopping_list_table">
                <tbody>
                    <tr>
                        <td>기본 배송지</td>
                        <td>{userData ? userData.deliveryInfo.defaultDeliveryAddress : "없음"}</td>
                    </tr>
                    <tr>
                        <td>배송지 1</td>
                        <td>{userData ? userData.deliveryInfo.firstDeliveryAddress : "없음"}</td>
                    </tr>
                    <tr>
                        <td>배송지 2</td>
                        <td>{userData ? userData.deliveryInfo.secondDeliveryAddress : "없음"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Delivery;
