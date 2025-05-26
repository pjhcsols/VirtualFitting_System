import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`;

export const Button = styled.div`
  width: 100px;
  height: 38px;
  margin: 0 auto;
  background-color: transparent;
  border-radius: 4px;
  border: 1px solid #121212;
  font-size: 0.75rem;
  font-weight: 800;
  color: black;
`;

export const ImageSliderComponent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const SliderContainer = styled.div<{ photoCount: number }>`
  width: ${(props) => {
    return props.photoCount === 1 ? "100%" : `${100 * props.photoCount}%`;
  }};
  transition: 0.3s all ease-in-out;
`;

export const PhotoUploader = styled.div`
  position: relative;
  width: 100%;
  object-fit: contain;
  border-radius: 8px;
  background-color: #d9d9d9;
  cursor: pointer;
`;

export const IconContainer = styled.div`
  position: absolute;
  padding: 10px 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const Icon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fffafa;
`;

export const ImageViewer = styled.img`
  width: 100%;
  object-fit: contain;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.4s all ease-out;
  &:hover {
    transform: scale(1.05);
  }
`;

export const DotContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 100%;
  }
`;
