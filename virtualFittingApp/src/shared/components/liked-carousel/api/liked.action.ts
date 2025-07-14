import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import { LikedItem } from "@/shared/components/liked-carousel/types/likedItem";

export const getLikedList = async (userId: String): Promise<LikedItem[]> => {
    const response = await API_BASILIUM.get("/likes/like/list", {
      params: { userId },
    });
    return response.data;     
};