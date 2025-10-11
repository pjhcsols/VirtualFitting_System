import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { OrderItem } from "@/entities/order";
import type { ReviewData } from "@/entities/review";
import { orderDummyData } from "@/entities/order";
import { postProductReview } from "@/pages/my/api/review.aciton";
import type { BodySize } from "@/pages/my/types/user";

export const useReviewForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const editReview: ReviewData | undefined = location.state?.reviewData;

  let title = "";

  const [order, setOrder] = useState<OrderItem | null>(null);
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
    const foundOrder = orderDummyData.find((item) => item.id === id);
    setOrder(foundOrder || null);

    if (editReview) {
      setRating(editReview.rating);
      setReviewText(editReview.reviewText);
      setPhotoPreviewImages(editReview.photos || []);
    }
  }, [id, editReview]);

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

  // const handleRegister = () => {
  //   if (!order) {
  //     alert("주문 정보를 찾을 수 없습니다.");
  //     return;
  //   }
  //   if (reviewText.length < 20) {
  //     alert("리뷰를 20자 이상 작성해주세요.");
  //     return;
  //   }

  //   const existingReviews: ReviewData[] = JSON.parse(localStorage.getItem("reviews") || "[]");
  //   const newReview: ReviewData = {
  //     id: order.id,
  //     brand: order.brand,
  //     productName: order.productName,
  //     option: order.options,
  //     rating,
  //     reviewText,
  //     photos: photoPreviewImages,
  //     date: new Date().toISOString()
  //   };

  //   const updatedReviews = editReview
  //     ? existingReviews.map((r) => r.id === editReview.id ? newReview : r)
  //     : [...existingReviews, newReview];

  //   localStorage.setItem("reviews", JSON.stringify(updatedReviews));
  //   alert(editReview ? "리뷰가 수정되었습니다." : "리뷰가 등록되었습니다.");
  //   navigate("/mypage/review");
  // };

  const handleRegister = async () => {
    if (!order) return alert("주문 정보를 찾을 수 없습니다.");
    if (reviewText.trim().length < 20)
      return alert("리뷰를 20자 이상 작성해주세요.");

    try {
      const body = {
        purchaseSize: order.options.size,
        purchaseColor: order.options.color,
        rating,
        title: title.trim() || `${order.productName} 리뷰`,
        comment: reviewText.trim(),
      };

      await postProductReview(order.id, body, photoFiles);
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
