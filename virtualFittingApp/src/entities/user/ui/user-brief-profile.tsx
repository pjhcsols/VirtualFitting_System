import styled from 'styled-components';
import { getMaskedUserName } from '@/shared/lib/mask.util';
import icon_user from "@/shared/assets/icons/icon-user.svg";
import icon_arrow from "@/shared/assets/icons/icon-arrow.svg";
import { BREAKPOINTS } from '@/shared';

type Props = { userId: string; onClick: () => void; };

export function UserBriefProfile({ userId, onClick }: Props) {
  return (
    <Wrapper onClick={onClick}>
      <Avatar src={icon_user} alt="유저 이미지" />
      <UserName>{getMaskedUserName(userId)}</UserName>
      <ArrowIcon src={icon_arrow} alt=">" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  justify-content: flex-start;
  padding: 16px 4px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const ArrowIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  color: black;
  cursor: pointer;
`;