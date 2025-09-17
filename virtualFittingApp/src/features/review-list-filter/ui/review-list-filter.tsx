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
      <TabInner>
        {TABS.map((tab) => (
          <TabText
            key={tab}
            onClick={() => onTabClick(tab)}
            $active={activeTab === tab}
          >
            {tab}
          </TabText>
        ))}
      </TabInner>
    </StickyTabWrapper>
  );
}

export const StickyTabWrapper = styled.div`
  position: sticky;
  z-index: 100;
  width: 100%;
  background: rgba(200, 200, 200, 0.15);
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
`;

export const TabInner = styled.div`
  display: flex;
  gap: 24px;
  max-width: 800px;
  width: 100%;
  padding: 10px 0;
  margin: 0 auto;

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
