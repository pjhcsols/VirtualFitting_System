import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { 
  type ProductDetail, 
  type ClaimableCoupon, 
  type ProductColorPayment, 
  type ProductSizePayment, 
  SIZE_ORDER
} from "@/shared";
import { createPaymentReservation, createPaymentIntent } from "@/features";
import { fetchDiscountQuote, fetchClaimableCoupons, downloadCoupon } from "@/pages/store/api/products.action";

declare const TossPayments: any;
const clientKey = "test_ck_ORzdMaqN3wxZAZWjPQWgV5AkYXQG";
type PaymentMethod = 'CARD' | 'TRANSFER' | 'VIRTUAL_ACCOUNT';

export const useProductContainer = (product: ProductDetail, onColorChange?: (color: string) => void) => {
  const [cookies] = useCookies(['access-token']);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [price, setPrice] = useState<{ original: number; discounted?: number } | null>(null);
  const [coupons, setCoupons] = useState<ClaimableCoupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<ClaimableCoupon | null>(null);
  const [downloadedCoupon, setDownloadedCoupon] = useState<{ walletId: number; campaignId: number; } | null>(null);

  const [quantity, setQuantity] = useState(1);
  const queryColor = searchParams.get("color");
  const initialColor = queryColor ?? product.productOptions[0].productColor;
  const [selectedColor, setSelectedColor] = useState(initialColor);
  
  const initialSize = product.productOptions.find(opt => opt.productColor === initialColor)?.productSize as ProductSizePayment;
  const [selectedSize, setSelectedSize] = useState<ProductSizePayment>(initialSize);
  
  const [mainImage, setMainImage] = useState(product.productImages.productPhotoUrls[0]);
  
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [showPaymentTab, setShowPaymentTab] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('CARD');

  useEffect(() => {
    const accessToken = cookies['access-token'];
    fetchDiscountQuote({ productId: product.productId, userId: accessToken })
      .then(quote => {
        if (quote?.data) setPrice({ original: quote.data.baseUnitPrice, discounted: quote.data.finalUnitPrice });
      })
      .catch(err => console.error("Failed to fetch discount quote", err));
  }, [product.productId, cookies]);

  const refreshCoupons = async () => {
    try {
        const accessToken = cookies['access-token'];
        const data = await fetchClaimableCoupons(product.productId, accessToken);
        if (data) {
        setCoupons(data);
        }
    } catch (error) { 
        console.error("Failed to refetch claimable coupons", error); 
    }
  };

  const sizesSorted = useMemo(() => product.productOptions
    .filter(po => po.productColor === selectedColor)
    .map(po => po.productSize as ProductSizePayment)
    .sort((a, b) => (SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))), [product.productOptions, selectedColor]);

  const selectedProductImages = useMemo(() => product.productImages.productColor === selectedColor
    ? product.productImages.productPhotoUrls
    : [], [product.productImages, selectedColor]);

  const finalPrice = useMemo(() => {
    if (!price) return 0;
    const basePrice = (price.discounted ?? price.original) * quantity;
    if (!selectedCoupon) return basePrice;
    let couponDiscount = basePrice * (selectedCoupon.percent / 100);
    if (couponDiscount > selectedCoupon.maxDiscountPrice) couponDiscount = selectedCoupon.maxDiscountPrice;
    return Math.round(basePrice - couponDiscount);
  }, [price, quantity, selectedCoupon]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange?.(color);
    const newSize = product.productOptions.find(opt => opt.productColor === color)?.productSize as ProductSizePayment;
    if (newSize) setSelectedSize(newSize);
    const newImages = product.productImages.productColor === color ? product.productImages.productPhotoUrls : [];
    if (newImages.length > 0) setMainImage(newImages[0]);
  };
  
  const handlePurchaseClick = () => {
    if (!cookies['access-token']) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
    } else {
      setShowPaymentTab(true);
    }
  };

  const handleDownloadCoupon = async (campaignId: number) => {
    const authUserId = cookies['access-token'];

    if (!authUserId) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
      return;
    }

    try {
      const result = await downloadCoupon({ campaignId, authUserId });
      if (result) {
        alert("쿠폰이 발급되었습니다!");
        setDownloadedCoupon(result); 
        refreshCoupons();
      }
    } catch (error) {
      console.error("Coupon download failed in component", error);
    }
  };

  const handleSelectCoupon = (coupon: ClaimableCoupon | null) => {
    if (!coupon || selectedCoupon?.campaignId === coupon.campaignId) {
      setSelectedCoupon(null);
    } else {
      setSelectedCoupon(coupon);
    }
    setShowCouponPopup(false);
  };

  const handlePurchase = async () => {
    setPaymentLoading(true);
    try {
      const accessToken = cookies['access-token'];
      const userIdToSend = accessToken ? accessToken : "";

      const reservationResponse = await createPaymentReservation({
        productId: product.productId,
        productColor: selectedColor as ProductColorPayment,
        productSize: selectedSize,
        count: quantity,
        userId: userIdToSend
      });

      const reservationData = reservationResponse?.data;
      if (!reservationData?.reserveTaskOrderPayId) throw new Error("결제 예약에 실패했습니다.");

      const reservedOrderId = reservationData.reserveTaskOrderPayId;
      const intentResponse = await createPaymentIntent({
        orderId: reservedOrderId,
        currency: finalPrice,
        lines: [{
          productId: product.productId,
          size: selectedSize,
          color: selectedColor,
          quantity: quantity,
          couponWalletId: downloadedCoupon?.walletId
        }],
        expiresAt: reservationData.expiresAt,
        pointsToUse: 0
      });
      const intentData = intentResponse?.data;
      if (!intentData) throw new Error("결제 정보 확정에 실패했습니다.");

      sessionStorage.setItem('reservationId', reservationData.reserveTaskOrderPayId);
      const tossPayments = TossPayments(clientKey);
      await tossPayments.requestPayment(selectedPaymentMethod, {
        amount: intentData.pgAmount,
        orderId: intentData.orderId,
        orderName: product.productName,
        customerName: "고객이름",
        customerEmail: "customer@example.com",
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (error: any) {
      console.error("Payment request failed:", error);
      alert(`결제 요청 실패: ${error.message || "알 수 없는 오류가 발생했습니다."}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  return {
    price, coupons, selectedCoupon, quantity, showCouponPopup, showPaymentTab, paymentLoading,
    selectedColor, selectedSize, mainImage, finalPrice, sizesSorted, selectedProductImages, selectedPaymentMethod,
    setQuantity, setShowCouponPopup, setShowPaymentTab, setSelectedPaymentMethod, setSelectedSize, setMainImage, setSelectedColor,
    handlePurchaseClick, handleDownloadCoupon, handleSelectCoupon, handlePurchase, handleColorChange,
  };
};