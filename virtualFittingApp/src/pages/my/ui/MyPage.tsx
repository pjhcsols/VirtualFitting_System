import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MYUSER_ICON, ARROW_ICON } from "../constants";
import { getMaskedUserName } from "@/shared";
import { BREAKPOINTS } from "@/shared";
import Cookies from "js-cookie";
import { fetchUserInfo } from "@/pages/my/api/get.action";

function MyPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(Cookies.get("userId") ?? null);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    setReviewCount(storedReviews.length);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const info = await fetchUserInfo(); 
        const userId = Cookies.get("userId") ?? info?.data?.id ?? null;
        if (mounted) setUserId(userId);
      } catch (e) {
        console.error("유저 정보 불러오기 실패", e);
        if (mounted) setUserId(null);
      } 
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <PageWrapper>
      <ContentWrapper>
        <GlassPanel>
          <UserInfoSection>
            <UserInfo onClick={() => navigate("/mypage/detail")}>
              <Avatar src={MYUSER_ICON} alt="유저 이미지" />
              <UserName>{getMaskedUserName(userId ?? "")}</UserName>
              <ArrowImg2 src={ARROW_ICON} alt=">" />
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
            <Stat onClick={() => navigate("/mypage/review")}>
              후기작성
              <ReviewCount>{reviewCount}개</ReviewCount>
            </Stat>
          </StatsWrapper>

          <MenuList>
            <MenuItem>
              좋아요
              <ArrowImg
                src={ARROW_ICON}
                onClick={() => navigate("/mypage/like")}
                alt=">"
              />
            </MenuItem>
            <MenuItem>
              주문내역
              <ArrowImg
                src={ARROW_ICON}
                onClick={() => navigate("/mypage/order")}
                alt=">"
              />
            </MenuItem>
            <MenuItem>
              취소/반품/교환 내역
              <ArrowImg
                src={ARROW_ICON}
                onClick={() => navigate("/mypage/cancel")}
                alt=">"
              />
            </MenuItem>
          </MenuList>
        </GlassPanel>
      </ContentWrapper>
    </PageWrapper>
  );
}

export { MyPage };

const PageWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  padding: 20px;
  margin-bottom: 40px;
  box-sizing: border-box;

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
  color: rgba(255, 255, 255, 0.9);
  font-family: "Prata-Regular";
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
`;

const StatsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.9);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  width: 100%;
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
  color: rgba(255, 255, 255, 0.9);
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
  color: rgba(255, 255, 255, 0.9);
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
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  text-align: left;
  margin-left: 8px;
`;

const ArrowImg = styled.img`
  width: 25px;
  height: 25px;
  opacity: 0.6;
`;

const ArrowImg2 = styled.img`
  width: 28px;
  height: 28px;
  margin-left: -15px;
  opacity: 0.6;
`;

const GlassPanel = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 24px;
  border-radius: 18px;

  background: rgba(200, 200, 200, 0.15);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);

  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 10px 30px rgba(0, 0, 0, 0.15);
`;