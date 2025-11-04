import type { ApiResponse } from "@/shared/types/api";

export type ProductIdsResponse = ApiResponse<number[]>; 

export interface LikeStatus {
    liked: boolean;
}

export type LikeStatusResponse = ApiResponse<LikeStatus>;

export interface LikedItem {
productPhotoUrl: string[];
productName: string;
}