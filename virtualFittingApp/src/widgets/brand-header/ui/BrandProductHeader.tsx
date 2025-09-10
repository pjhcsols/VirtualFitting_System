import { NavLink } from "react-router-dom";
import styled from "styled-components";

function BrandProductHeader() {
  const headerContent = [
    { name: "상품 리스트", to: "/brand/product/list" },
    { name: "상품 등록", to: "/brand/product/create" },
    { name: "쿠폰 설정", to: "/brand/product/coupon" },
  ];
  return (
    <HeaderWrapper>
      {headerContent.map((item, key: number) => {
        return (
          <HeaderContent key={key} to={item.to}>
            {({ isActive }: { isActive: boolean }) => (
              <InfoBox clicked={isActive}>
                <HeaderText>{item.name}</HeaderText>
              </InfoBox>
            )}
          </HeaderContent>
        );
      })}
    </HeaderWrapper>
  );
}

export { BrandProductHeader };

const HeaderWrapper = styled.header`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`;

const HeaderContent = styled(NavLink)`
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
`;

const HeaderText = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
`;

const InfoBox = styled.div<{ clicked: boolean }>`
  width: 100%;
  min-height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s all ease;
  border-bottom: ${(props) => props.clicked && "1px solid #9ac4ff"};
  &:hover {
    background-color: #d9d9d9;
  }
`;
