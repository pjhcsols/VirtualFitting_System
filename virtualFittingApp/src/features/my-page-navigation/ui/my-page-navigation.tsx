import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import icon_arrow from '@/shared/assets/icons/icon-arrow.svg';
import { BREAKPOINTS } from '@/shared';

const MENU_ITEMS = [
  { title: "좋아요", path: "/mypage/like" },
  { title: "주문내역", path: "/mypage/order" },
  { title: "취소/반품/교환 내역", path: "/mypage/cancel" },
];

export function MyPageNavigation() {
  const navigate = useNavigate();
  return (
    <MenuList>
      {MENU_ITEMS.map(item => (
        <MenuItem key={item.path} onClick={() => navigate(item.path)}>
          {item.title}
          <ArrowIcon src={icon_arrow} alt=">" />
        </MenuItem>
      ))}
    </MenuList>
  );
}

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

const ArrowIcon = styled.img`
  width: 12px;
  height: 12px;
  object-fit: contain;
  color: black;
  cursor: pointer;
`;