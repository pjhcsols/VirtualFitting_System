import axios from 'axios';

const API_URL = "http://155.230.43.12:8090/normalUser";

export const fetchUserInfo = async (jwtToken: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  try {
    const response = await axios.get(`${API_URL}/user/detail`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const deleteItemFromCart = async (shoppingListId: string, jwtToken: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  try {
    await axios.delete(`${API_URL}/shopping/list?shoppingListId=${shoppingListId}`, config);
  } catch (error) {
    console.error("Error deleting item from shopping cart:", error);
    throw error;
  }
};
