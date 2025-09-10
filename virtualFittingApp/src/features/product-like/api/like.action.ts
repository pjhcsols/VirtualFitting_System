import { API_BASILIUM } from "@/shared";

export const toggleLike = async (productId: number, userId: string): Promise<any | null> => {
  try {
    const response = await API_BASILIUM.post(`/likes/like/${productId}`, null, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Toggle like failed:", error);
    return null;
  }
};

export const getLikeRank = async (): Promise<any | null> => {
  try {
    const response = await API_BASILIUM.get(`/likes/like/rank`);
    return response.data;
  } catch (error) {
    console.error("Fetch like rank failed:", error);
    return null;
  }
};

export const getMyLikes = async (userId: string): Promise<any | null> => {
  try {
    const response = await API_BASILIUM.get(`/likes/like/list`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch my likes failed:", error);
    return null;
  }
};
