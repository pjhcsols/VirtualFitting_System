import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authState } from '@/entities/auth';
import { useMyDashboard } from '../hooks/use-my-dashboard';
import { UserBriefProfile } from '@/entities/user';
import { UserStats } from '@/features/user-stats';
import { MyPageNavigation } from '@/features/my-page-navigation';
import { GlassBox } from '@/shared/components/glass-box';
import { useEffect } from 'react';
import { fetchUserInfo } from '@/shared/api/get.api';

export function MyDashboard() {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authState);
  const { userId, reviewCount } = useMyDashboard();

  useEffect(() => {
    if (!userId) {
      const loadUserInfo = async () => {
        try {
          const res = await fetchUserInfo();
          if (res.data.id) {
            setAuth({ isLoggedIn: true, userId: res.data.id });
          }
        } catch (error) {
          console.error('Failed to fetch user info', error);
        }
      };
      loadUserInfo();
    }
  }, [userId, setAuth]);

  return (
    <DashboardPanel>
      {userId && (
        <UserBriefProfile
          userId={userId}
          onClick={() => navigate('/mypage/detail')}
        />
      )}
      <Divider />
      <UserStats reviewCount={reviewCount} />
      <MyPageNavigation />
    </DashboardPanel>
  );
}

const DashboardPanel = styled(GlassBox)`
  width: 100%;
  max-width: 1200px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Divider = styled.hr`
  margin: 0;
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  width: 100%;
`;
