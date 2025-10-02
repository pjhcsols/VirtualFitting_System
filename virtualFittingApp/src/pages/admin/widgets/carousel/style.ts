import styled from "styled-components";

export const CarouselContainer = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
`;

export const CarouselWrapper = styled.div<{ showControls: boolean }>`
  position: relative;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const ImageContainer = styled.div`
  position: relative;
  height: 384px;
  overflow: hidden;
`;

export const NavigationContainer = styled.div<{ showControls: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  opacity: ${(props) => (props.showControls ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

export const NavButton = styled.button`
  background-color: white;
  color: #374151;
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f9fafb;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  padding: 1rem 0;
`;

export const Dot = styled.button<{ isActive: boolean }>`
  width: ${(props) => (props.isActive ? "1.5rem" : "0.5rem")};
  height: 0.5rem;
  border-radius: 0.25rem;
  border: none;
  background-color: ${(props) => (props.isActive ? "#3b82f6" : "#d1d5db")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#3b82f6" : "#9ca3af")};
  }
`;

export const ActionButtonContainer = styled.div<{ showControls: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: ${(props) => (props.showControls ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

export const ActionButton = styled.button`
  background-color: white;
  color: #374151;
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f9fafb;
  }
`;
