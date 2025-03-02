// import React, { useState, useEffect } from "react";

// import { API_BASILIUM, ShoppingCart } from "@/shared";
// import { useShoppingCartData } from "@/pages/shopping-cart/utils/items.util";
// import { useUserData } from "@/pages/my/utils/data.util";

// // 데이터 타입 정의
// interface OrderData {
//   orderId: number;
//   productName: string;
//   price: number;
//   date: string;
// }

// const MyPage: React.FC = () => {
//   const [orderData, setOrderData] = useState<OrderData[]>([]);
//   const { userData } = useUserData();
//   const { shoppingData, likedItems } = useShoppingCartData();

//   useEffect(() => {
//     // 주문 내역 가져오기
//     API_BASILIUM.get<OrderData[]>("/normalUser/order/history")
//       .then((response) => {
//         setOrderData(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching order data:", error);
//       });
//   }, []);

//   return (
//     <div>
//       <Header_Bottom />
//       {userData && <Profile_Header userData={userData} />}
//       <Product_Order_List orderData={orderData} />
//       <ShoppingCart shoppingData={shoppingData} />
//       <Like_List likeData={likedItems} />
//     </div>
//   );
// };

import React from "react";

function MyPage() {
  return <div>MyPage</div>;
}

export { MyPage };
