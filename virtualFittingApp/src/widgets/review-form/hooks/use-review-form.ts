import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import type { OrderItem } from "@/entities/order";
import type { ReviewData } from '@/entities/review';
import { orderDummyData } from "@/entities/order";

export const useReviewForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const editReview: ReviewData | undefined = location.state?.reviewData;

  const [order, setOrder] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [photoPreviewImages, setPhotoPreviewImages] = useState<string[]>([]);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const foundOrder = orderDummyData.find((item) => item.id === id);
    setOrder(foundOrder || null);

    if (editReview) {
      setRating(editReview.rating);
      setReviewText(editReview.reviewText);
      setPhotoPreviewImages(editReview.photos || []);
    }
  }, [id, editReview]);

  const handlePhotoUploadClick = () => {
    photoInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).slice(0, 5 - photoPreviewImages.length);

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPhotoPreviewImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setPhotoPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRegister = () => {
    if (!order) {
      alert("주문 정보를 찾을 수 없습니다.");
      return;
    }
    if (reviewText.length < 20) {
      alert("리뷰를 20자 이상 작성해주세요.");
      return;
    }

    const existingReviews: ReviewData[] = JSON.parse(localStorage.getItem("reviews") || "[]");
    const newReview: ReviewData = {
      id: order.id,
      brand: order.brand,
      productName: order.productName,
      option: order.options,
      rating,
      reviewText,
      photos: photoPreviewImages,
      date: new Date().toISOString()
    };

    const updatedReviews = editReview
      ? existingReviews.map((r) => r.id === editReview.id ? newReview : r)
      : [...existingReviews, newReview];
    
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    alert(editReview ? "리뷰가 수정되었습니다." : "리뷰가 등록되었습니다.");
    navigate("/mypage/review");
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
    handlePhotoUploadClick,
    handleImageChange,
    handleRemoveImage,
    handleRegister,
  };
};

