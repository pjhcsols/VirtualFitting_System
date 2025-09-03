import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";

export type CreateReviewBody = {
    paymentId: number;
    rating: number;
    title: string;
    comment: string;
    purchaseSize: string;
    purchaseColor: string;
};

export const createProductReview = async (
    productId: string | number,
    body: CreateReviewBody,
    //   files: File[] = []
) => {
    const form = new FormData();

    form.append("review", JSON.stringify(body));

    const res = await API_BASILIUM.post(
        `/b1/products/${productId}/reviews`,
        form
    );

    if (res.status === 200) {
        return res.data;
    }
};
