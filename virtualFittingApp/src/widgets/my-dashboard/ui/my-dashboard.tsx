import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMyDashboard } from '../hooks/use-my-dashboard';
import { UserBriefProfile } from '@/entities/user'; 
import { UserStats } from '@/features/user-stats'; 
import { MyPageNavigation } from '@/features/my-page-navigation';
import { GlassBox } from '@/shared/components/glass-box';

export function MyDashboard() {
  const navigate = useNavigate();
  const { userId, reviewCount } = useMyDashboard();

  return (
    <DashboardPanel>
      <UserBriefProfile 
        userId={userId} 
        onClick={() => navigate("/mypage/detail")} 
      />
      <Divider />
      <UserStats reviewCount={reviewCount} />
      <MyPageNavigation />
    </DashboardPanel>
  );
}

const DashboardPanel = styled(GlassBox)`
  width: 100%;
  max-width: 1000px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;=
`;

const Divider = styled.hr`
  margin: 0;
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  width: 100%;
`;
