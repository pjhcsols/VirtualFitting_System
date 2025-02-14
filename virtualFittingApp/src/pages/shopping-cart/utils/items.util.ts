import { useState, useEffect } from "react";
import { fetchLikedItems } from "../api/like.action";
import { fetchDataItems } from "../api/data.action";

const useShoppingCartData = () => {
  const [shoppingData, setShoppingData] = useState([]);
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    const jwtToken = localStorage.getItem("login-token");
    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    fetchDataItems(config)
      .then((data) => setShoppingData(data))
      .catch((error) => console.error("Error fetching shopping data", error));

    fetchLikedItems(config)
      .then((data) => setLikedItems(data))
      .catch((error) => console.error("Error fetching liked items", error));
  }, []);

  return { shoppingData, likedItems };
};

export default useShoppingCartData;
