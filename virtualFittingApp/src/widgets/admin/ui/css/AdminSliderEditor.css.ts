import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: black;
`;

export const ImageSliderComponent = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const SliderContainer = styled.div<{ photoCount: number }>`
  width: ${(props) => {
    return props.photoCount === 1 ? "100%" : `${100 * props.photoCount}%`;
  }};
  height: 100%;
  transition: 0.3s all ease-in-out;
`;

export const PhotoUploader = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #121212;
  background-color: #fffafa;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const PhotoUploaderInput = styled.input`
  display: none;
`;

export const Icon = styled.img`
  width: 50px;
  height: 50px;
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
  transition: 0.2s all ease-out;
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
`;

export const Dot = styled.div<{ isClicked: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background: ${(props) => (props.isClicked ? "#243b55" : "#d9d9d9")};
  transition: 0.2s all ease-in-out;
  &:hover {
    background: #243b55;
  }
`;
