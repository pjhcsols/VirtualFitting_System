import styled from "styled-components";
import {
  CardIcon,
  HeartIcon,
  CouponIcon,
  MoneyIcon,
  ClothesIcon,
} from "../../icon";
import { formatNumberWithCommas } from "@/shared/utils";
import { ProfitGraph } from "../../graph";

export function BrandBannerCard({
  profile,
  username,
}: {
  profile?: string;
  username: string;
}) {
  return (
    <BrandProfileWrapper>
      <Title>{username}</Title>
    </BrandProfileWrapper>
  );
}

export function BrandProfitGraphCard() {
  return (
    <ProfitGraphWrapper>
      <ProfitInfoContainer>
        <ProfitTitleContainer>
          <ProfitIconBox>
            <MoneyIcon width="24px" height="24px" fill="#8FBC8F" />
          </ProfitIconBox>
          <Text>수익 그래프</Text>
        </ProfitTitleContainer>
        <ProfitInfoBox></ProfitInfoBox>
      </ProfitInfoContainer>
      <ProfitGraph />
    </ProfitGraphWrapper>
  );
}

export function BrandCouponCard({ couponCount }: { couponCount: number }) {
  return (
    <BrandCouponWrapper>
      <CouponIconBox>
        <CouponIcon width="24px" height="24px" fill="blue" />
      </CouponIconBox>
      <Text>발행한 쿠폰 수</Text>
      <Title>{couponCount}</Title>
    </BrandCouponWrapper>
  );
}

export function BrandIncomeCard({ income }: { income: number }) {
  return (
    <BrandIncomeCardWrapper>
      <CardIconBox>
        <CardIcon width="24px" height="24px" fill="#FFD700" />
      </CardIconBox>
      <Text>총 수익</Text>
      <Title>₩{formatNumberWithCommas(income)}</Title>
    </BrandIncomeCardWrapper>
  );
}

export function BrandHeartCard({ likedCount }: { likedCount: number }) {
  return (
    <BrandHeartWrapper>
      <HeartIconBox>
        <HeartIcon width="24px" height="24px" fill="#FF6347" />
      </HeartIconBox>
      <Text>총 하트 수</Text>
      <Title>{formatNumberWithCommas(likedCount)}</Title>
    </BrandHeartWrapper>
  );
}

export function BrandClothesCard({ sellCount }: { sellCount: number }) {
  return (
    <ClothesWrapper>
      <ClothesIconBox>
        <ClothesIcon width="24px" height="24px" fill="#feaf55" />
      </ClothesIconBox>
      <Text>총 판매량</Text>
      <Title>{formatNumberWithCommas(sellCount)}</Title>
    </ClothesWrapper>
  );
}

const WideBigCardWrapper = styled.div`
  box-sizing: border-box;
  padding: 1.5rem;
  min-width: 40rem;
  min-height: 20rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 12px;
  background-color: white;
  transition: 0.15s all ease;
  flex-shrink: 1;
  &:hover {
    background-color: #efefef;
  }
`;

const WideSmallCardWrapper = styled.div`
  box-sizing: border-box;
  padding: 1.5rem;
  min-width: 40rem;
  min-height: 10rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 12px;
  background-color: white;
  transition: 0.15s all ease;
  flex-shrink: 1;
  &:hover {
    background-color: #efefef;
  }
`;

const SmallCardWrapper = styled.div`
  box-sizing: border-box;
  padding: 1.5rem;
  min-width: 10rem;
  min-height: 10rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 12px;
  background-color: white;
  transition: 0.15s all ease;
  flex-shrink: 1;
  &:hover {
    background-color: #efefef;
  }
`;

const BrandIncomeCardWrapper = styled(SmallCardWrapper)``;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

const Title = styled.h2`
  font-size: 0.9rem;
  font-weight: 700;
  color: black;
`;

const Text = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #a0a0a0;
`;

const CardIconBox = styled(IconWrapper)`
  background-color: #fbf6da;
`;

const BrandHeartWrapper = styled(SmallCardWrapper)``;

const HeartIconBox = styled(IconWrapper)`
  background-color: #ffd0d8;
`;

const BrandProfileWrapper = styled(WideSmallCardWrapper)``;

const BrandCouponWrapper = styled(SmallCardWrapper)``;

const CouponIconBox = styled(IconWrapper)`
  background-color: #dee4ff;
`;

const ProfitGraphWrapper = styled(WideBigCardWrapper)``;

const ProfitTitleContainer = styled.div`
  width: 10rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

const ProfitInfoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfitInfoBox = styled.div`
  min-width: 20rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`;

const ProfitIconBox = styled(IconWrapper)`
  background-color: #c6f9c6;
`;

const ClothesWrapper = styled(SmallCardWrapper)``;

const ClothesIconBox = styled(IconWrapper)`
  background-color: #ffd38c;
`;
