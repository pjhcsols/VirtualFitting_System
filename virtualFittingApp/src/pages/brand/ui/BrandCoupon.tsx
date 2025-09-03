import { useEffect, useState } from "react";
import styled from "styled-components";
import { ServerCouponDto } from "../types/coupon";
import { getCouponList } from "../api/coupon.action";

function BrandCoupon() {
  const [coupons, setCoupons] = useState<ServerCouponDto[]>([]);
  const [errMsg, setErrMsg] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCouponList({ page: 0, size: 10 });
        setCoupons(res);
      } catch (err) {
        if (err instanceof CustomException) {
          setErrMsg(err.message);
        }
        return err;
      }
    };
    fetchData();
  }, []);
  return (
    <Wrapper>
      <CouponBannerWrapper>
        <CouponTitle>쿠폰</CouponTitle>
      </CouponBannerWrapper>
      <CouponContainer>
        {coupons.length !== 0 ? (
          coupons.map((item: ServerCouponDto, key) => {
            return <CouponColumn key={key}></CouponColumn>;
          })
        ) : (
          <></>
        )}
      </CouponContainer>
    </Wrapper>
  );
}

export { BrandCoupon };

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

const CouponBannerWrapper = styled.div`
  box-sizing: border-box;
  padding: 2rem;
  width: 100%;
  min-width: calc(40rem + 16px);
  min-height: 10rem;
  border-radius: 8px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CouponTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  color: black;
`;

const CouponContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CouponColumn = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;
