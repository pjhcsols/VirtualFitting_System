import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 2rem 3rem;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
`;

export const InfoWrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
`;

export const PhotoContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InfoContainer = styled.div`
  position: relative;
  width: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

export const SizeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const SizeBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MaterialContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const MaterialBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SubmitButton = styled.div`
  appearance: none;
  background-color: transparent;
  border: 2px solid #1a1a1a;
  border-radius: 15px;
  box-sizing: border-box;
  color: #3b3b3b;
  cursor: pointer;
  display: inline-block;
  font-family: "Pretendard";
  font-size: 16px;
  font-weight: 600;
  color: black;
  line-height: normal;
  margin: 0;
  width: 40%;
  min-height: 45px;
  min-width: 140px;
  outline: none;
  padding: 16px 24px;
  text-align: center;
  text-decoration: none;
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  will-change: transform;
  &:disabled {
    pointer-events: none;
  }
  &:hover {
    color: #fff;
    background-color: #1a1a1a;
    box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
    transform: translateY(-2px);
  }
  &:active {
    box-shadow: none;
    transform: translateY(0);
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 1000px;
  background: #d9d9d9 5%;
`;

export const SizeTableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

export const ColorContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const ColorBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
`;

export const SubPhotoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: flex-start;
`;

export const SizeText = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: black;
`;

export const DescriptionText = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: black;
`;
