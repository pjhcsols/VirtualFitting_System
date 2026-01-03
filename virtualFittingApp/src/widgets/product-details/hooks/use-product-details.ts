import { useState, useEffect } from "react";
import { useRecoilValue } from 'recoil';
import { authState, getAccessTokenStringFromCookie } from '@/entities/auth'; 
import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "@/entities/product/model/types";
import { useAddToCart } from '@/features/add-to-cart';
import { useProductOptions } from '@/features/product-options';
import { createPaymentReservation } from "@/entities/payment";
import type { ProductColorPayment, ProductSizePayment } from '@/entities/payment';
import type { PostCartMeRequest } from "@/entities/cart";

export const useProductDetails = (
  product: ProductDetail, 
  price: { original: number; discounted?: number } | null,
  onColorChange?: (color: string) => void
) => {
  const isLoggedIn = useRecoilValue(authState);
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState(product.productImages.productPhotoUrls?.[0] ?? '');
  const [showPaymentTab, setShowPaymentTab] = useState(false);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);

  const {
    quantity, setQuantity,
    selectedColor, setSelectedColor,
    selectedSize, setSelectedSize,
    sizesSorted,
    handleColorChange,
  } = useProductOptions(product, onColorChange);
  
  useEffect(() => {
    setMainImage(product.productImages.productPhotoUrls?.[0] ?? '');
  }, [product]);

  const selectedProductImages = product.productImages?.productPhotoUrls ?? [];
  
  const { addToCart, isPending: isAddingToCart } = useAddToCart();

  const handleAddToCart = () => {
    const accessToken = getAccessTokenStringFromCookie();
    if (!accessToken) {
      navigate('/login');
      return;
    }

    const itemData: PostCartMeRequest = {
      items: [{
        productId: product.productId,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
      }]
    };
    
    addToCart({ accessToken, itemData });
  };

  const handlePurchaseClick = async () => {
    setIsProcessingPurchase(true);
    try {
      const accessToken = getAccessTokenStringFromCookie();
      if (!isLoggedIn || !accessToken) {
        navigate('/login');
        return;
      }

      if (!price || !selectedColor || !selectedSize) {
        alert("상품 옵션을 선택해주세요.");
        return;
      }

      const reservationResponse = await createPaymentReservation({
        productId: product.productId,
        productColor: selectedColor as ProductColorPayment,
        productSize: selectedSize as ProductSizePayment,
        count: quantity,
        userId: accessToken,
      });

      const reservationData = reservationResponse?.data;
      if (!reservationData?.reserveTaskOrderPayId) {
        throw new Error("상품 재고를 예약하는 데 실패했습니다.");
      }
      
      const itemDetails = {
        id: product.productId,
        productId: product.productId,
        name: product.productName,
        brand: product.brandUser.firmName,
        image: selectedProductImages[0],
        price: price.original,
        discountedPrice: price.discounted,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
      };

      navigate('/payment', { 
        state: { 
          item: itemDetails,
          reservation: reservationData,
        } 
      });

    } catch (error) {
      console.error("Purchase failed:", error);
      alert("구매 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  const checkAuth = (): boolean => {
    if (!isLoggedIn) {
      navigate('/login');
      return false;
    }
    return true;
  };
  
  return {
    price, quantity, showPaymentTab, 
    paymentLoading: isProcessingPurchase,
    selectedColor, selectedSize, mainImage, sizesSorted, selectedProductImages, 
    isAddingToCart,
    setQuantity, setShowPaymentTab, setSelectedColor, setSelectedSize, setMainImage,
    handleAddToCart, handlePurchaseClick, handleColorChange, checkAuth
  };
};
