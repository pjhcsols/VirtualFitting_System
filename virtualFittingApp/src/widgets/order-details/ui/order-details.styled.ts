import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  background: #ffffff;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  color: #333;
`;

export const Section = styled.section`
  width: 100%;
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionLabel = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 14px;
  line-height: 1.6;
  
  & + & {
    margin-top: 8px;
  }
`;

export const InfoTitle = styled.span`
  font-weight: 500;
  color: #888;
  flex-shrink: 0;
  margin-right: 16px;
`;

export const InfoContent = styled.span`
  font-weight: 500;
  color: #333;
  text-align: right;
`;

export const Divider = styled.hr`
  margin: 32px 0;
  border: none;
  height: 1px;
  background-color: #f0f0f0;
  width: 100%;
`;

export const OrderCard = styled.div`
  display: flex;
  gap: 16px;
`;

export const ImageBox = styled.img`
  width: 78px;
  height: 95px;
  background-color: #f0f0f0;
  border-radius: 8px;
  object-fit: cover;
`;

export const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 4px;
`;

export const Brand = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

export const ProductName = styled.div`
  font-size: 14px;
`;

export const OptionText = styled.div`
  font-size: 13px;
  color: #888;
`;

export const Price = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-top: 4px;
`;

