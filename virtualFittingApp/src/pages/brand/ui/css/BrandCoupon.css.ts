import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

export const CouponBannerWrapper = styled.div`
  box-sizing: border-box;
  padding: 2rem;
  min-width: calc(40rem + 16px);
  min-height: 10rem;
  border-radius: 8px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: white;
  transition: 0.15s all ease;
  &:hover {
    background-color: #efefef;
  }
`;

export const CouponTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  color: black;
`;

export const CouponSmallTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: black;
`;

export const CouponList = styled.div`
  box-sizing: border-box;
  padding: 2rem;
  min-width: 20rem;
  min-height: 20rem;
  border-radius: 8px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: white;
  transition: 0.15s all ease;
  &:hover {
    background-color: #efefef;
  }
`;

export const CouponCreatePanel = styled.div`
  box-sizing: border-box;
  padding: 2rem;
  min-width: 20rem;
  min-height: 20rem;
  border-radius: 8px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: white;
  transition: 0.15s all ease;
  &:hover {
    background-color: #efefef;
  }
`;

export const CouponExpiredCountPanel = styled.div`
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

export const ExpiredCouponPanel = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: rgb(216, 216, 185);
`;

export const ExpiredTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 700;
  color: black;
`;

export const ExpiredText = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: #a0a0a0;
`;
