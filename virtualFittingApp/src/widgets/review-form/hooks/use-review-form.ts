import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ReviewData } from "@/entities/review";
import type { BodySize } from "@/entities/user/model/types";
import type { ReviewOrderPayload } from "@/entities/order";
import { postProductReview } from "@/features/write-review";
import { getPaymentInfo } from "@/entities/payment";

export const useReviewForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const statePayload = (location.state as ReviewOrderPayload | undefined) ?? undefined;
  const editReview: ReviewData | undefined = (location.state as any)?.reviewData;

  const order: ReviewOrderPayload | null = statePayload ?? null;

  const [paymentId, setPaymentId] = useState<number>(0);

  const title = "";
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const [photoPreviewImages, setPhotoPreviewImages] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const initialSize: BodySize = {
    height: 0,
    weight: 0,
    totalLength: 0,
    chest: 0,
    shoulder: 0,
    arm: 0,
    pantsTotalLength: 0,
    waistWidth: 0,
    hipWidth: 0,
    rise: 0,
    hemWidth: 0,
  };
  const [sizes, setSizes] = useState<BodySize>(initialSize);

  useEffect(() => {
    if (!order?.item?.productId) return;

    const fetchPaymentInfo = async () => {
      try {
        const res = await getPaymentInfo({page: 0, size: 10});
        const paymentId = res?.data?.content;
        console.log(paymentId);

        setPaymentId(paymentId);
      } catch (e) {
        console.error("paymentId 조회 실패:", e);
        setPaymentId(0);
      }
    };

    fetchPaymentInfo();
  }, []);

  useEffect(() => {
    if (editReview) {
      setRating(editReview.rating);
      setReviewText(editReview.reviewText);
      setPhotoPreviewImages(editReview.photos || []);
    }
  }, [editReview]);

  const handleSizeChange = (field: keyof BodySize, value: number) => {
    setSizes((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoUploadClick = () => {
    photoInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 최대 5장 제한 반영
    const remain = 5 - photoFiles.length;
    const picked = Array.from(files).slice(0, remain);

    // 프리뷰 생성
    picked.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPhotoPreviewImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // 실제 업로드 파일 저장
    setPhotoFiles((prev) => [...prev, ...picked]);
  };

  const handleRemoveImage = (index: number) => {
    setPhotoPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegister = async () => {
    if (!order) return alert("주문 정보를 찾을 수 없습니다.");
    if (reviewText.trim().length < 20)
      return alert("리뷰를 20자 이상 작성해주세요.");

    try {
      const body = {
        paymentId: paymentId,
        purchaseSize: order.item.options.size,
        purchaseColor: order.item.options.color,
        rating,
        title: title.trim() || `${order.item.productName} 리뷰`,
        comment: reviewText.trim(),
      };

      await postProductReview(order.item.productId, body, photoFiles);
      alert(editReview ? "리뷰가 수정되었습니다." : "리뷰가 등록되었습니다.");
      console.log(body);
      navigate("/mypage/review");
    } catch (err: any) {
      // 사용자 birthDate, address 없으면 400
      console.error(err);
      alert(
        err?.response?.data?.message ?? "리뷰 등록 중 오류가 발생했습니다.",
      );
    }
  };

  return {
    order,
    rating,
    setRating,
    reviewText,
    setReviewText,
    photoPreviewImages,
    photoInputRef,
    editReview,
    sizes,
    setSizes,
    handlePhotoUploadClick,
    handleImageChange,
    handleRemoveImage,
    handleRegister,
    handleSizeChange,
  };
};
