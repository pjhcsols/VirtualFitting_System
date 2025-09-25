import styled from 'styled-components';
import { BREAKPOINTS } from '@/shared';
import {StickyTabWrapper, ToggleButton} from "@/features/review-list-filter/ui/review-list-filter";

const TABS = ["전체", "취소/반품", "교환"];

type Props = {
  activeTab: string;
  onTabClick: (tab: string) => void;
};

export function CancelListFilter({ activeTab, onTabClick }: Props) {
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


const ButtonGroup = styled.div`
  display: inline-flex;
  gap: 0;                 
  margin: 10px 0;
  margin-right: 460px;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(200,200,200,0.12);

  @media (max-width: ${BREAKPOINTS.md}px) {
    margin: 8px 16px;
    width: calc(100% - 32px);
    justify-content: space-between;
  }
`;