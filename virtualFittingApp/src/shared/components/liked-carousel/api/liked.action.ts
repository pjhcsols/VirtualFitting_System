import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";
import { LikedItem } from "@/shared/components/liked-carousel/types/likedItem";

export const getLikedList = async (): Promise<LikedItem[]> => {
    try {
      const response = await API_BASILIUM.get("/likes/like/list");
      return response.data;
    } catch (error) {
      console.error("좋아요 리스트 조회 중 오류 발생:", error);
      return [];
    }
  };