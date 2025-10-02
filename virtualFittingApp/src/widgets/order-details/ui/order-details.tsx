import { useOrderDetails } from "../hooks/use-order-details";
import { formatSimpleDate } from "@/shared/lib/date.util";
import alertImg from "@/shared/assets/images/alert-fallback.png";
import * as S from "./order-details.styled";

export function OrderDetails() {
  const { order, isLoading, error } = useOrderDetails();

  if (isLoading) return <div>주문 정보를 불러오는 중...</div>;
  if (error || !order) return <div>주문 정보를 찾을 수 없습니다.</div>;

  return (
    <S.Wrapper>
      <S.Section>
        <S.SectionLabel>주문 정보</S.SectionLabel>
        <S.InfoRow>
          <S.InfoTitle>주문일자</S.InfoTitle>
          <S.InfoContent>{formatSimpleDate(order.date)}</S.InfoContent>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoTitle>주문번호</S.InfoTitle>
          <S.InfoContent>{`20250922-${order.id}`}</S.InfoContent>
        </S.InfoRow>
      </S.Section>

      <S.Divider />
      
      <S.Section>
        <S.SectionLabel>주문 상품</S.SectionLabel>
        <S.OrderCard>
          <S.ImageBox src={order.productImageUrl || alertImg} alt={order.productName} />
          <S.RightSection>
            <S.Brand>{order.brand}</S.Brand>
            <S.ProductName>{order.productName}</S.ProductName>
            <S.OptionText>
              {order.options.color} / {order.options.size} / {order.options.quantity}개
            </S.OptionText>
            <S.Price>{order.price.toLocaleString()}원</S.Price>
          </S.RightSection>
        </S.OrderCard>
      </S.Section>

      <S.Divider />
      
      <S.Section>
        <S.SectionLabel>배송 정보</S.SectionLabel>
        <S.InfoRow>
          <S.InfoTitle>받는 분</S.InfoTitle>
          <S.InfoContent>김**</S.InfoContent>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoTitle>연락처</S.InfoTitle>
          <S.InfoContent>010-****-1234</S.InfoContent>
        </S.InfoRow>
        <S.InfoRow>
          <S.InfoTitle>주소</S.InfoTitle>
          <S.InfoContent>부산광역시 ** ******</S.InfoContent>
        </S.InfoRow>
      </S.Section>
    </S.Wrapper>
  );
}

