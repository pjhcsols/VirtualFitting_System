import { API_BASILIUM } from "@/shared";
import type { ProductIdsResponse, LikeStatusResponse, LikeStatus } from "../model/types";

export const fetchMyLikedProductIds = async (
    authUserId: string
): Promise<number[] | null> => {
    try {
        const response = await API_BASILIUM.get<ProductIdsResponse>(
            "/b1/likes/me/product-ids",
            { params: { authUserId } }
        );
        console.log("[좋아요 상품 ID 목록 조회] 성공.");
        return response.data.data;
    } catch (error) {
        console.error("[좋아요 상품 ID 목록 조회] 실패:", error);
        return null;
    }
};

export const toggleProductLike = async (
    authUserId: string,
    productId: number
): Promise<LikeStatus | null> => {
    try {
        const response = await API_BASILIUM.post<LikeStatusResponse>(
            `/b1/likes/products/${productId}/toggle`,
            null,
            { params: { authUserId } }
        );
        console.log(`[좋아요 토글] 상품 ID ${productId} 성공. New status: ${response.data.data.liked}`);
        return response.data.data;
    } catch (error) {
        console.error(`[좋아요 토글] 상품 ID ${productId} 실패:`, error);
        return null;
    }
};
