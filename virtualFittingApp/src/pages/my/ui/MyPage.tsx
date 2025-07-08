import { useState, useEffect } from "react";
import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";
import { useNavigate } from "react-router-dom";
import { MYUSER_ICON } from "@/pages/my/constants";
import { getMaskedUserName } from "@/shared";
import { BREAKPOINTS} from "@/shared";
import arrowImg from "./arrow.png";

function MyPage() {
  const navigate = useNavigate();
  const userName = "user1";
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
      const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
      setReviewCount(storedReviews.length);
  }, []);

  return (
    <PageWrapper>
      <HeaderWrapper>
        <MyHeader title="마이페이지" backPath="/"/>
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
          <Stat>
            포인트
            <ReviewCount>0원</ReviewCount>
          </Stat>
          <Stat>
            쿠폰
            <ReviewCount>0개</ReviewCount>
          </Stat>
          <Stat onClick={() => navigate("/myPage/review")}>
            후기작성
            <ReviewCount>{reviewCount}개</ReviewCount>
          </Stat>
        </StatsWrapper>

        <MenuList>
          <MenuItem>
            좋아요
            <ArrowImg src={arrowImg} onClick={() => navigate("/myPage/like")} alt=">" />
          </MenuItem>
          <MenuItem>
            주문내역
            <ArrowImg
              src={arrowImg}
              onClick={() => navigate("/myPage/order")}
              alt=">"
            />
          </MenuItem>
          <MenuItem>
            취소/반품/교환 내역
            <ArrowImg
              src={arrowImg}
              onClick={() => navigate("/myPage/cancel")}
              alt=">"
            />
          </MenuItem>
        </MenuList>
      </ContentWrapper>
    </PageWrapper>
  );
}

export { MyPage };

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: #fff;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 10px;
    max-width: 100%;
  }
`;

const UserInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  justify-content: flex-start;
  margin-top: 30px;
  max-width: 1000px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
  }
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
  font-family: "Prata-Regular";
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  height: 1px;
  background-color: #e5e5e5;
  width: 100%;
`;

const StatsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 1000px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
  }
`;

const Stat = styled.div`
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-family: "Prata-Regular";
  color: #999;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const ReviewCount = styled.span`
  font-size: 14px;
  font-weight: bold;
  font-family: "Prata-Regular";
  color: #555;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1000px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
  }
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 5px;
  font-size: 14px;
  font-family: "Prata-Regular";
  border-bottom: 1px solid #eee;
  cursor: pointer;
  text-align: left;
  margin-left: 8px;
`;

const ArrowImg = styled.img`
  width: 20px;
  height: 20px;
  opacity: 0.6;
`;

const ArrowImg2 = styled.img`
  width: 28px;
  height: 28px;
  opacity: 0.6;
  margin-left: -15px;
  margin-top: 2.8px;
`;
