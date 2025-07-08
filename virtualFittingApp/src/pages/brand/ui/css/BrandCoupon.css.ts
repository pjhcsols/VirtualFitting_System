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
  min-width: 50rem;
  min-height: 10rem;
  border-radius: 8px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: white;
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
`;
