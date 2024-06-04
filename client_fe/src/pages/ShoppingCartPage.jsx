import React, { useState, useEffect } from "react";
import Header_Bottom from "../components/Header_Bottom";
import ShoppingCart from "../components/ShoppingCart";
import LikedCarousel from "../components/LikedCarousel";
import axios from "axios";

const ShoppingCartPage = () => {
  const [shoppingData, setShoppingData] = useState([]);
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    const jwtToken = localStorage.getItem("login-token");

    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`, // Authorization 헤더에 JWT 포함
      },
    };
    axios
      .get("http://155.230.43.12:8090/normalUser/shopping/list", config)
      .then((response) => {
        setShoppingData(response.data);
        console.log("3번--------------");
        console.log(response.data);
        console.log("3번--------------");
      })
      .catch((error) => {
        console.log("Error fetching order data:", error);
      }, []);

    // 좋아요 목록 또한 가져와야 함
    axios
      .get("http://155.230.43.12:8090/normalUser/like/list", config) // 좋아요 목록을 가져오는 API 엔드포인트를 입력해야 함
      .then((response) => {
        console.log("좋아요 정보");
        console.log(response.data);
        setLikedItems(response.data);
        console.log("좋아요 정보");
      })
      .catch((error) => {
        console.log("Error fetching liked items:", error);
      });
  }, []);

  return (
    <div>
      <Header_Bottom />
      <ShoppingCart shoppingData={shoppingData} />
      <LikedCarousel likedItems={likedItems} />
    </div>
  );
};

export default ShoppingCartPage;
