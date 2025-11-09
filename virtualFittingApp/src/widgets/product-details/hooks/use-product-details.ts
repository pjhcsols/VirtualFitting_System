import { useState, useEffect } from "react";
import { Cookies } from 'react-cookie';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth'; 
import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "@/entities/product/model/types";
import { useAddToCart } from '@/features/add-to-cart';
import { useInitiateCheckout } from "@/features/initiate-checkout-single";
import { useProductOptions } from '@/features/product-options';

const cookiesInstance = new Cookies();

export const useProductDetails = (
  product: ProductDetail, 
  price: { original: number; discounted?: number } | null,
  onColorChange?: (color: string) => void
) => {
  const isLoggedIn = useRecoilValue(authState);
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState(product.productImages.productPhotoUrls?.[0] ?? '');
  const [showPaymentTab, setShowPaymentTab] = useState(false);

  const {
    quantity, setQuantity,
    selectedColor, setSelectedColor,
    selectedSize, setSelectedSize,
    sizesSorted,
    handleColorChange,
  } = useProductOptions(product, onColorChange);
  
  const { initiateCheckout, isLoading: paymentLoading } = useInitiateCheckout();

  useEffect(() => {
    setMainImage(product.productImages.productPhotoUrls?.[0] ?? '');
  }, [product]);

  const selectedProductImages = product.productImages?.productPhotoUrls ?? [];
  
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const handleAddToCart = () => {
    const authUserId = cookiesInstance.get('access-token');
    if (!authUserId) {
      navigate('/login');
      return;
    }

    const itemData = {
      productId: product.productId,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      brandUserNumber: product.brandUser.userNumber,
      brandFirmName: product.brandUser.firmName,
    };

    addToCart({ authUserId, itemData });
  };

  const handlePurchaseClick = () => {

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!price) return;

    initiateCheckout({
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
    });
  };

  const checkAuth = (): boolean => {
    if (!isLoggedIn) {
      navigate('/login');
      return false;
    }
    return true;
  };
  
  return {
    price, quantity, showPaymentTab, paymentLoading,
    selectedColor, selectedSize, mainImage, sizesSorted, selectedProductImages, 
    isAddingToCart,
    setQuantity, setShowPaymentTab, setSelectedColor, setSelectedSize, setMainImage,
    handleAddToCart, handlePurchaseClick, handleColorChange, checkAuth
  };
};
