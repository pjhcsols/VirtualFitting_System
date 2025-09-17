import { useState, useEffect, useMemo } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { 
  SIZE_ORDER
} from "@/shared";
import { fetchDiscountQuote } from "@/entities/product/api";
import type { PaymentMethod } from "@/entities/payment/model/types";
import type { ProductDetail } from "@/entities/product/model/types";
import type { ProductColorPayment, ProductSizePayment } from "@/entities/payment/model/types";

import { useProductCoupon } from '@/features/product-coupon';
import { useAddToCart } from '@/features/add-to-cart';
import { useInitiateCheckout } from "@/features/initiate-checkout-single";

export const useProductDetails = (product: ProductDetail, onColorChange?: (color: string) => void) => {
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();

  const [price, setPrice] = useState<{ original: number; discounted?: number } | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] = useState<ProductColorPayment>(product.productImages.productColor as ProductColorPayment);  
  const [selectedSize, setSelectedSize] = useState(() => 
    product.productOptions.find(opt => opt.productColor === product.productImages.productColor)?.productSize as ProductSizePayment
  );
  const [mainImage, setMainImage] = useState(product.productImages.productPhotoUrls[0] ?? '');

  const [showPaymentTab, setShowPaymentTab] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('CARD');
  
  const { initiateCheckout, isLoading: paymentLoading } = useInitiateCheckout();

  useEffect(() => {
    setSelectedColor(product.productImages.productColor as ProductColorPayment); 
    setSelectedSize(product.productOptions.find(opt => opt.productColor === product.productImages.productColor)?.productSize as ProductSizePayment);
    setMainImage(product.productImages.productPhotoUrls[0] ?? '');
  }, [product]);

  useEffect(() => {
    const accessToken = cookies['access-token'];
    fetchDiscountQuote({ productId: product.productId, userId: accessToken })
      .then(quote => {
        if (quote?.data) setPrice({ original: quote.data.baseUnitPrice, discounted: quote.data.finalUnitPrice });
      })
      .catch(err => console.error("Failed to fetch discount quote", err));
  }, [product.productId, cookies]);

  const sizesSorted = useMemo(() => product.productOptions
    .filter(po => po.productColor === selectedColor)
    .map(po => po.productSize as ProductSizePayment)
    .sort((a, b) => (SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))), [product.productOptions, selectedColor]);

  const selectedProductImages = product.productImages.productPhotoUrls;

  const { 
    coupons, 
    selectedCoupon, 
    downloadedCoupon, 
    showCouponPopup, 
    setShowCouponPopup,
    handleDownloadCoupon, 
    handleSelectCoupon 
  // } = useProductCoupon(product.productId, (coupon) => {
  // });
  } = useProductCoupon(product.productId);

  const finalPrice = useMemo(() => {
    if (!price) return 0;
    const basePrice = (price.discounted ?? price.original) * quantity;
    if (!selectedCoupon) return basePrice;
    let couponDiscount = basePrice * (selectedCoupon.percent / 100);
    if (couponDiscount > selectedCoupon.maxDiscountPrice) couponDiscount = selectedCoupon.maxDiscountPrice;
    return Math.round(basePrice - couponDiscount);
  }, [price, quantity, selectedCoupon]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color as ProductColorPayment);
    const newSize = product.productOptions.find(opt => opt.productColor === color)?.productSize as ProductSizePayment;
    if (newSize) setSelectedSize(newSize);
    
    onColorChange?.(color);
  };

  const { handleAddToCart } = useAddToCart({
    product,
    price,
    selectedColor,
    selectedSize,
    quantity,
    selectedProductImages,
  });

  const handlePurchaseClick = () => {
    const accessToken = cookies['access-token'];
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
    } else {
      setShowPaymentTab(true);
    }
  };

  const handlePurchase = () => {
    if (!finalPrice) return;
    initiateCheckout({
      productId: product.productId,
      productName: product.productName,
      productColor: selectedColor,
      productSize: selectedSize,
      quantity: quantity,
      finalPrice: finalPrice,
      couponWalletId: downloadedCoupon?.walletId,
      paymentMethod: selectedPaymentMethod,
    });
  };

  return {
    price, coupons, selectedCoupon, quantity, showCouponPopup, showPaymentTab, paymentLoading,
    selectedColor, selectedSize, mainImage, finalPrice, sizesSorted, selectedProductImages, selectedPaymentMethod,
    setQuantity, setShowCouponPopup, setShowPaymentTab, setSelectedPaymentMethod, setSelectedSize, setMainImage,
    handleAddToCart, handlePurchaseClick, handleDownloadCoupon, handleSelectCoupon, handlePurchase, handleColorChange,
  };
};