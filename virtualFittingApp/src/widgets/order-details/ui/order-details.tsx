import { useOrderDetails } from "../hooks/use-order-details";
import { formatSimpleDate } from "@/shared/lib/date.util";
import alertImg from "@/shared/assets/images/alert-fallback.png";
import Cookies from "js-cookie";
import * as S from "./order-details.styled";

export function OrderDetails() {
  const authUserId = Cookies.get("userId");
  const { detail, isLoading, error } = useOrderDetails(authUserId);

  if (isLoading) return <div>주문 정보를 불러오는 중...</div>;
  if (error || !detail) return <div>주문 정보를 찾을 수 없습니다.</div>;

  return (
    <S.Wrapper>
      <S.Section>
        <S.SectionLabel>주문 정보</S.SectionLabel>
        <S.InfoRow>
          <S.InfoTitle>주문일자</S.InfoTitle>
          <S.InfoContent>{formatSimpleDate(detail.createdAt)}</S.InfoContent>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoTitle>주문번호</S.InfoTitle>
          <S.InfoContent>{detail.orderId}</S.InfoContent>
        </S.InfoRow>
      </S.Section>

      <S.Divider />

      <S.Section>
        <S.SectionLabel>배송 정보</S.SectionLabel>
        <S.InfoRow>
          <S.InfoTitle>받는 분</S.InfoTitle>
          <S.InfoContent>{detail.recipientName}</S.InfoContent>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoTitle>주소</S.InfoTitle>
          <S.InfoContent>{detail.addressFull}</S.InfoContent>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoTitle>연락처</S.InfoTitle>
          <S.InfoContent>{detail.recipientPhone}</S.InfoContent>
        </S.InfoRow>
      </S.Section>

      <S.Divider />

      <S.Section>
        <S.SectionLabel>주문 상품</S.SectionLabel>
        {detail.items.map((it) => (
          <S.OrderCard key={it.id}>
            <S.ImageBox src={it.productImageUrl || alertImg} alt={it.productName} />
            <S.RightSection>
              <S.Brand>{it.brand}</S.Brand>
              <S.ProductName>{it.productName}</S.ProductName>
              <S.OptionText>
                {it.options.color} / {it.options.size} / {it.options.quantity}개
              </S.OptionText>
              <S.Price>{it.price.toLocaleString()}원</S.Price>
            </S.RightSection>
          </S.OrderCard>
        ))}
      </S.Section>

      <S.Divider />

      <S.Section>
        <S.SectionLabel>결제 정보</S.SectionLabel>
        <S.InfoRow>
          <S.InfoTitle>상품 금액</S.InfoTitle>
          <S.InfoContent>{detail.amounts.productAmount.toLocaleString()}원</S.InfoContent>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoTitle>할인 금액</S.InfoTitle>
          <S.InfoContent>{detail.amounts.brandDiscount.toLocaleString()}원</S.InfoContent>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoTitle>쿠폰 사용</S.InfoTitle>
          <S.InfoContent>{detail.amounts.couponDiscount.toLocaleString()}원</S.InfoContent>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoTitle>포인트 사용</S.InfoTitle>
          <S.InfoContent>{detail.amounts.walletUsed.toLocaleString()}원</S.InfoContent>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoTitle>결제 금액</S.InfoTitle>
          <S.InfoContent>{detail.amounts.finalPay.toLocaleString()}원</S.InfoContent>
        </S.InfoRow>
      </S.Section>
    </S.Wrapper>
  );
}
