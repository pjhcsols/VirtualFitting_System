import { API_BASILIUM } from "@/shared/config/axios/AxiosConfig";

export type ReviewRequest = {
  purchaseSize: string;
  purchaseColor: string;
  rating: number;
  title: string;
  comment: string;
};

export async function postProductReview(
  productId: string,
  review: ReviewRequest,
  images: File[] = []
) {
  const form = new FormData();

  form.append(
    "review",
    new Blob([JSON.stringify(review)], { type: "application/json" })
  );

  images.forEach((file) => form.append("images", file));

  const res = await API_BASILIUM.post(`/b1/products/${productId}/reviews`, form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data; 
}
