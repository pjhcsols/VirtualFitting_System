import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";
import { useNavigate } from "react-router-dom";
import { MYUSER_ICON } from "@/pages/my/constants";
import { getMaskedUserName } from "@/shared";
import arrowImg from "./arrow.png";

function MyPage() {
  const navigate = useNavigate();
  const userName = "user1";

  return (
    <PageWrapper>
      <HeaderWrapper>
        <MyHeader title="마이페이지" />
      </HeaderWrapper>

      <ContentWrapper>
        <UserInfoSection>
          <UserInfo onClick={() => navigate("/mypage/detail")}> 
            <Avatar src={MYUSER_ICON} alt="유저 이미지" />
            <UserName>{getMaskedUserName(userName)}</UserName>
            <ArrowImg2 src={arrowImg} alt=">" />
          </UserInfo>
        </UserInfoSection>

        <Divider />

        <StatsWrapper>
          <Stat>포인트</Stat>
          <Stat>쿠폰</Stat>
          <Stat>후기 작성</Stat>
        </StatsWrapper>

        <MenuList>
          <MenuItem>
            좋아요
            <ArrowImg src={arrowImg} onClick={() => navigate("/myPage/like")} alt=">" />
          </MenuItem>
          <MenuItem>
            주문내역
            <ArrowImg src={arrowImg} onClick={() => navigate("/myPage/order")} alt=">" />
          </MenuItem>
          <MenuItem>
            취소/반품/교환 내역
            <ArrowImg src={arrowImg} onClick={() => navigate("/myPage/cancel")} alt=">" />
          </MenuItem>
        </MenuList>
      </ContentWrapper>
    </PageWrapper>
  );
}

export { MyPage };

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100vh;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;   // 
  padding: 70px 0;
  width: 100%;
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  cursor: pointer;

  width: 100%;
  max-width: 550px;
  justify-content: flex-start;
  margin-top: 30px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  height: 1px;
  background-color: #e5e5e5;
  width: 100%;
  max-width: 550px;
`;

const StatsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 530px;
`;

const Stat = styled.div`
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 550px;
`;

const MenuItem = styled.div`
  display: flex;  
  justify-content: space-between;
  padding: 13px 5px;
  font-size: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  text-align: left;
  margin-left: 8px;
`;

const ArrowImg = styled.img`
  width: 20px;
  height: 20px;
  opacity: 0.6;
`

const ArrowImg2 = styled.img`
  width: 28px;
  height: 28px;
  opacity: 0.6;
  margin-left: -15px;
  margin-top: 2.8px;
`