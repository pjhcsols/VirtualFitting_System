import styled from "styled-components";
import { useEffect, useRef,useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ProductDetail } from "@/shared";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";
import { createPaymentReservation, handlePaymentResponse } from "@/features/payment/api/payment.action";
import type { ProductColorPayment, ProductSizePayment, PaymentResultParams } from "@/shared"; 

import {
  ProductSmallCard,
  LikeButton,
  AddButton,
  AIButton,
  PurchaseButton,
  QuantityBox,
  BREAKPOINTS,
  COLOR_MAP,
  SIZE_ORDER,
} from "@/shared";

import {
  ICON_SHARE,
} from "@/shared";

type ProductContainerProps = {
  product: ProductDetail;
  productColors: string[];
  onColorChange?: (color: string) => void;
};

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "wwXaKkcYycdO5JSA1QlWV";

function ProductContainer({ product, productColors, onColorChange }: ProductContainerProps) {
  const [searchParams] = useSearchParams();
  const queryColor = searchParams.get("color");
  const [showPaymentTab, setShowPaymentTab] = useState(false);

  const selectedColor =
    queryColor && product.productOptions.some(opt => opt.productColor === queryColor)
      ? queryColor
      : product.productOptions[0].productColor;

  const sizesSorted: ProductSizePayment[] = product.productOptions
    .filter(po => po.productColor === selectedColor)
    .map(po => po.productSize as ProductSizePayment)
    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));


  const [selectedSize, setSelectedSize] = useState<ProductSizePayment>(product.productOptions[0].productSize as ProductSizePayment);

  const [quantity, setQuantity] = useState(1);

  const selectedProductImages =
    product.productImages.productColor === selectedColor
      ? product.productImages.productPhotoUrls
      : [];

  const [mainImage, setMainImage] = useState(selectedProductImages[0]);

  const isProductColor = (color: string): color is ProductColorPayment => {
  return ["BLACK", "WHITE", "GRAY", "BLUE", "RED", "YELLOW", "GREEN", "ORANGE"].includes(color);
  };

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<any>(null); 

  useEffect(() => {
    (async () => {
      const widget = await loadPaymentWidget(clientKey, customerKey);
      paymentWidgetRef.current = widget;
    })();
  }, []);

  useEffect(() => {
    if (showPaymentTab && paymentWidgetRef.current) {
      const widget = paymentWidgetRef.current.renderPaymentMethods(
        "#payment-methods",
        product.productPrice
      );
      paymentMethodsWidgetRef.current = widget;
    }
  }, [showPaymentTab]);


  const handlePurchaseClick = () => {
    setShowPaymentTab(true);
  };

  const closeTab = () => {
    setShowPaymentTab(false);
  };

  // const [taskId, setTaskId] = useState<string | null>(null);
  // const [showCheckout, setShowCheckout] = useState(false);

  // const onPaymentComplete = async (success: boolean) => {
  //   setShowCheckout(false);

  //   if (taskId) {
  //     try {
  //       await handlePaymentResponse({ taskId, success });
  //       console.log("Payment result processed");
  //     } catch (error) {
  //       console.error("Error processing payment result", error);
  //     }
  //   }
  // };

  // const handleCompletePayment = async (taskId: string, success: boolean) => {
  //   try {
  //     const resultMessage = await handlePaymentResponse({ taskId, success });
  //     console.log("Payment result processed:", resultMessage);
  //     console.log(success ? "true" : "false");
  //   } catch (error) {
  //     console.error("Error processing payment result:", error);
  //   }
  // };

  const handlePurchase = async () => {
    if (!isProductColor(selectedColor)) {
      console.log("Invalid color selected.");
      return;
    }

    if (!paymentMethodsWidgetRef.current) {
      console.log("결제수단이 선택되지 않았습니다. 결제수단을 선택해주세요.");
      alert("결제수단을 선택해 주세요.");
      return;
    }

    const paymentResponse = await createPaymentReservation({
      productId: product.productId,
      productColor: selectedColor,
      productSize: selectedSize,
      count: quantity,
    });

    if (!paymentResponse?.taskId) {
      console.log("Failed to get taskId from payment response.");
      return;
    }

    try {
      await paymentWidgetRef.current?.requestPayment({
        orderId: paymentResponse.taskId,
        orderName: product.productName,
        successUrl: `${window.location.origin}/payment-success`,
        failUrl: `${window.location.origin}/payment-fail`,
        customerName: "고객이름",
        customerEmail: "customer@example.com",
      });
    } catch (error) {
      console.error("Payment request failed:", error);
      window.location.href = `${window.location.origin}/payment-fail?message=${encodeURIComponent((error as Error).message)}`;
    }
  };

  return (
    <ProductBox>
      <ProductSmallImagesContainer>
        {selectedProductImages.map((src, i) => (
          <ProductSmallCard
            key={i}
            imageSrc={src}
            onMouseEnter={() => setMainImage(src)}
          />
        ))}
      </ProductSmallImagesContainer>
      <ProductImage src={mainImage} alt={product.productName} />
      <ProductInfoBox>
        <TopRow>
          <Brand>{product.brandUser.firmName}</Brand>
        </TopRow>
        <TopRow>
          <ProductName>{product.productName}</ProductName>
          <LikeButton />
        </TopRow>
        <TopRow>
          <Price>{product.productPrice.toLocaleString()}원</Price>
          <IconImage src={ICON_SHARE} alt="share icon" />
        </TopRow>
        <Description>{product.productDesc}</Description>
        <ColorBoxContainer>
          <SelectedColorText>
            {product.productMaterials.join(", ")} | {selectedColor}
          </SelectedColorText>
           <ColorSwatches>
      {productColors.map(color => (
        <ColorCircle
          key={color}
          $color={COLOR_MAP[color] ?? "transparent"}
          $selectedColor={selectedColor === color}
          onClick={() => onColorChange?.(color)}
        />
      ))}
    </ColorSwatches>
        </ColorBoxContainer>
        <SizeBoxContainer>
          <SizeBox>
            {sizesSorted.map(size => (
              <SizeItem
                key={size}
                $selectedSize={selectedSize === size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </SizeItem>
            ))}
          </SizeBox>
        </SizeBoxContainer>
        <OptionBox>
          <OptionTop>
            <OptionText>
              {selectedColor} · {selectedSize}
            </OptionText>
          </OptionTop>
          <QuantityBox
            unitPrice={product.productPrice}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </OptionBox>
        <ButtonBox>
          <AddButton
            product={{
              id: product.productId.toString(),
              name: product.productName,
              brand: product.brandUser.firmName,
              image: selectedProductImages[0],
              price: product.productPrice,
              discountedPrice: undefined,
              discountRate: undefined,
              color: selectedColor,
              size: selectedSize,
              quantity,
            }}
          />
        <PurchaseButton onClick={handlePurchaseClick} />
        {showPaymentTab && (
          <TabOverlay onClick={closeTab}>
            <TabContent onClick={e => e.stopPropagation()}>
              <h3>결제 수단 선택</h3>
              <div id="payment-methods" style={{ marginTop: 20 }}></div>
              <button onClick={handlePurchase}>결제 시작</button>
              <CloseButton onClick={closeTab}>닫기</CloseButton>
            </TabContent>
          </TabOverlay>
        )}
        </ButtonBox>
        <ButtonBox>
          <AIButton />
        </ButtonBox>
      </ProductInfoBox>
    </ProductBox>
  );
}


const ProductBox = styled.section`
  display: flex;
  gap: 4px;
  width: 100%;
  max-width: 1200px;
  flex-direction: row;
  // justify-content: space-between;
  align-items: flex-start;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 600px;
  max-height: 750px;
  object-fit: cover;
  height: auto;
  order: 0;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    max-width: 510px;
    max-height: 680px;
  }
`;

const ProductSmallImagesContainer = styled.div`
  display: flex;
  gap: 8px;
  height: 100%;
  object-fit: cover;
  flex-flow: column nowrap;
  margin: 0px 4px;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    order: 2;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ProductInfoBox = styled.div`
  width: 408px;
  display: flex;
  flex-direction: column;
  
  gap: 8px;
  order: 3;
  margin: 0px 24px;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    width: 100%;
  }
`;

const TopRow = styled.div`
  display: flex;
  min-width: 350px;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.div`
  font-family: "pretendard";
  font-weight: 500;
  font-size: 16px;
  color: black;
`;

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const ProductName = styled.div`
  font-family: "pretendard";
  font-weight: 400;
  font-size: 24px;
  color: black;
`;

const Price = styled.div`
  font-family: "pretendard";
  font-weight: 500;
  color: black;
  font-size: 24px;
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DiscountPrice = styled.div`
  font-family: "pretendard";
  font-size: 24px;
  font-weight: 200;
  color: black;
`;

const OriginalPriceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OriginalPrice = styled.div`
  font-family: "pretendard";
  font-size: 14px;
  color: gray;
  text-decoration: line-through;
`;

const DiscountRate = styled.div`
  font-family: "pretendard";
  font-size: 12px;
  color: white;
  background-color: black;
  padding: 0px 2px;
  background-color: red;
`;

const Description = styled.p`
  white-space: pre-line;
  display: flex;
  font-family: "pretendard";
  font-size: 14px;
  font-weight: 500;
  color: black;
  text-align: left;
  padding: 16px 0px;
`;

const ColorBoxContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 16px 0px;
`; 

const SelectedColorText = styled.div`
  display: flex;
  font-size: 12px;
  font-family: "pretendard";
  color: black;
`;

const ColorSwatches = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const ColorCircle = styled.div<{ $color: string; $selectedColor?: boolean }>`
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 1px solid gray;
  box-sizing: border-box;

  ${(props) =>
    props.$selectedColor &&
    `
    &::after {
      content: "";
      align-items: center;
      position: absolute;
      top: -5px;
      left: -5px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #ccc; 
      box-sizing: border-box;
    }
  `}
`;

const SizeBoxContainer = styled.div`
  max-width: 408px;
  min-width: 350px;
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 16px 0px 16px 0px;
`; 

const SizeText = styled.div`
  display: flex;
  font-size: 12px;
  font-family: "pretendard";
  color: black;
`;

const SizeBox = styled.div`
  max-width: 408px;
  min-width: 350px;
  display: flex;
  gap: 8px;
`; 

const SizeItem = styled.div<{ $selectedSize?: boolean }>`
  position: relative; /* 추가 */
  width: 80px;
  height: 40px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "pretendard";
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  color: black;

  ${(props) =>
    props.$selectedSize &&
    `
    &::before {
      content: "";
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border: 2px solid #dfdfdf;
      pointer-events: none;
      box-sizing: border-box;
      z-index: 0;
    }
    position: relative;
    z-index: 1;
  `}

  @media (max-width: ${BREAKPOINTS.lg}px) {
    min-width: 78px;
    color: black;
  }
`;

const OptionTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OptionText = styled.div`
  display: flex;
  font-size: 12px;
  font-family: "pretendard";
  color: black;
`;

const OptionBox = styled.div`
  min-width: 350px;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 4px;
  background-color: #f5f5f5;
  padding: 12px 16px;
  box-sizing: border-box;
`;

const ButtonBox = styled.div`
  min-width: 350px;
  display: flex;
  gap: 8px;
  padding: 2px 0px;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    justify-content: center;
    align-items: center;
  }
`; 

const TabOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const TabContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 460px;
  max-height: 520px;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  margin-top: 16px;
`;

export { ProductContainer };
