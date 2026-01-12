import { useState, useEffect } from 'react';
import styled from 'styled-components';
import awardAiImage from '@/assets/awards/award-ai.svg';
import awardWebImage from '@/assets/awards/award-web.svg';

const awardsData = [
  {
    id: 'ai-award-2025',
    imageSrc: awardAiImage,
    title: '2025 AI어워드코리아 AI서비스분야 대상',
  },
  {
    id: 'web-award-2025',
    imageSrc: awardWebImage,
    title: '2025 웹어워드코리아 IT솔루션분야 대상',
  },
];

const HIDE_AWARD_KEY_PREFIX = 'hide_award_';

export function AwardsPopup() {
  const [visibleAwards, setVisibleAwards] = useState<typeof awardsData>([]);
  const [currentAwardIndex, setCurrentAwardIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const now = new Date().getTime();
    const awardsToShow = awardsData.filter(award => {
      const hideUntil = localStorage.getItem(HIDE_AWARD_KEY_PREFIX + award.id);
      return !hideUntil || now >= parseInt(hideUntil, 10);
    });

    if (awardsToShow.length > 0) {
      setVisibleAwards(awardsToShow);
      const timer = setTimeout(() => {
        setIsVisible(true);
        setCurrentAwardIndex(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const showNextAward = () => {
    if (currentAwardIndex < visibleAwards.length - 1) {
      setCurrentAwardIndex(currentAwardIndex + 1);
    } else {
      setIsVisible(false);
    }
  };

  const handleClose = () => {
    showNextAward();
  };

  const handleDontShowToday = () => {
    const currentAward = visibleAwards[currentAwardIndex];
    if (!currentAward) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    localStorage.setItem(
      HIDE_AWARD_KEY_PREFIX + currentAward.id,
      tomorrow.getTime().toString()
    );

    showNextAward();
  };

  if (!isVisible || !visibleAwards[currentAwardIndex]) {
    return null;
  }

  const { imageSrc, title } = visibleAwards[currentAwardIndex];

  return (
    <ModalOverlay>
      <ModalContent>
        <Image src={imageSrc} alt={title} />
        <ButtonContainer>
          <ActionButton onClick={handleDontShowToday}>오늘 하루동안 보지않기</ActionButton>
          <ActionButton onClick={handleClose}>닫기</ActionButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  width: 100%;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
`;

const ActionButton = styled.button`
  cursor: pointer;
  font-size: 14px;
  color: #666;
  text-decoration: underline;

  &:hover {
    color: #000;
    text-decoration: underline;
  }
`;