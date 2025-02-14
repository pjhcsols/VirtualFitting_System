import React, { useState, useEffect } from "react";
import Payment from "../../payment/ui/Payment";
import { ShoppingCartProps } from '../types/shoppingCartProps';
import { fetchUserInfo, deleteItemFromCart } from '../api/shoppingCart.action';
import { User } from '../../../types/user';

const ShoppingCart: React.FC<ShoppingCartProps> = ({ shoppingData }) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [shoppingDataState, setShoppingData] = useState(shoppingData);

  useEffect(() => {
    setSelectedItems([]);
  }, [shoppingData]);

  useEffect(() => {
    const fetchUserInfoData = async () => {
      const jwtToken = localStorage.getItem("login-token");
      if (jwtToken) {
        try {
          const userDetails = await fetchUserInfo(jwtToken);
          setUserInfo(userDetails);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };
    fetchUserInfoData();
  }, []);

  const handleCheck = (index: number) => {
    const selectedIndex = selectedItems.indexOf(index);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, index]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== index));
    }
  };

  const handleDeleteSelected = async () => {
    const jwtToken = localStorage.getItem("login-token");
    if (jwtToken) {
      try {
        await Promise.all(selectedItems.map(async (index) => {
          const shoppingListId = shoppingDataState[index].shoppingCartId;
          await deleteItemFromCart(shoppingListId, jwtToken);
        }));
        const updatedList = shoppingDataState.filter(
          (_, index) => !selectedItems.includes(index)
        );
        setShoppingData(updatedList);
        setSelectedItems([]);
      } catch (error) {
        console.error("Error deleting selected items:", error);
      }
    }
  };

  const selectedProducts = selectedItems.map((index) => shoppingDataState[index]);
  const isEmpty = shoppingDataState.length === 0;

  return (
    <div>
      <div className="shopping_list_container">
        <div className="header_div">
          <h2 className="shopping_list_title" onClick={() => {}}>장바구니</h2>
          {userInfo && (
            <Payment userInfo={userInfo} selectedProducts={selectedProducts} type="multi" />
          )}
        </div>
        {isEmpty ? (
          <p>담은 물품이 없습니다.</p>
        ) : (
          <table className="shopping_list_table">
            <thead className="shopping_list_thead">
              <tr>
                <th>상품 정보</th>
                <th>상품 금액</th>
                <th>주문 수량</th>
                <th>주문 금액</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              {shoppingDataState.map((productObj, index) => (
                <tr key={index}>
                  <td>
                    <div className="product_info">
                      <img
                        className={productObj.photoUrl ? "image2" : "image1"}
                        // src={productObj.photoUrl ? productObj.photoUrl : product} 이미지 필요함 [수정]
                        alt="product"
                      />
                      <div className="product_details">
                        <span className="product_name">{productObj.productName}</span>
                        <br />
                        <span className="product_specs">
                          {"(색상: " + productObj.color + ", 사이즈: " + productObj.size + ")"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{productObj.price}원</td>
                  <td>{productObj.totalCnt}개</td>
                  <td>{productObj.price * productObj.totalCnt}원</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={() => handleCheck(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="choose_span">
        <button onClick={handleDeleteSelected}>선택 삭제</button>
      </div>
    </div>
  );
};

export default ShoppingCart;
