import styled from 'styled-components';
import { BREAKPOINTS } from '@/shared';

const TABS = ["작성가능", "작성완료"];

type ReviewListFilterProps = {
  activeTab: string;
  onTabClick: (tab: string) => void;
};

export function ReviewListFilter({ activeTab, onTabClick }: ReviewListFilterProps) {
  return (
    <StickyTabWrapper>
      <ButtonGroup role="tablist" aria-label="리뷰 상태 필터">
        {TABS.map((tab) => (
          <ToggleButton
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            $active={activeTab === tab}
            onClick={() => onTabClick(tab)}
          >
            {tab}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </StickyTabWrapper>
  );
}

export const StickyTabWrapper = styled.div`
  position: sticky;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const TabInner = styled.div`
  display: flex;
  gap: 24px;
  max-width: 800px;
  width: 100%;
  padding: 10px 16px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 10px 16px;
    max-width: 100%;
  }
`;

export const TabText = styled.span<{ $active: boolean }>`
  padding: 4px 2px;
  position: relative;
  
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  font-family: "Prata-Regular";

  color: ${(props) => (props.$active ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.85)')};
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: rgb(255, 255, 255);
    
    transform: scaleX(${(props) => (props.$active ? 1 : 0)});
    transform-origin: center;
    transition: transform 0.3s ease-out;
  }

  &:hover {
    color: rgb(255, 255, 255);
  }
`;

export const ButtonGroup = styled.div`
  display: inline-flex;
  gap: 0;                 
  margin: 10px 0;
  margin-right: 570px;
  padding: 4px;
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(200,200,200,0.12);

  @media (max-width: ${BREAKPOINTS.md}px) {
    margin: 8px 16px;
    width: calc(100% - 32px);
    justify-content: space-between;
  }
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  min-width: 110px;
  padding: 10px 16px;
  font-size: 14px;
  font-family: "Prata-Regular";
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255,255,255,0.5)')};
  background: ${({ $active }) => ($active ? '#292E49' : 'transparent')};
  border: 0;
  cursor: pointer;
  transition: background .2s ease, color .2s ease;
  border-radius: 30px;

  &:hover {
    background: ${({ $active }) => ($active ? '#292E49' : 'rgba(255,255,255,0.08)')};
    color: #fff;
  }
`;
