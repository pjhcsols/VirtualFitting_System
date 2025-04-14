import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  position: relative;
  padding: 2rem 8rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 120px;
`;

export const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ProfileContentContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
`;

export const ProfilePreviewCardContainer = styled.div`
  position: sticky;
  top: 0;
  width: 50%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const ProfileInfoContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ProfileButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ProfileBtn = styled.div<{ isClicked: boolean }>`
  appearance: button;
  background-color: ${(props) => (props.isClicked ? "#bbd2c5" : "#292e49")};
  background-image: none;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow:
    #fff 4px 4px 0 0,
    #000 4px 4px 0 1px;
  box-sizing: border-box;
  color: ${(props) => (props.isClicked ? "#212121" : "#fff")};
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  transition: 0.3s all ease-out;
  line-height: 20px;
  margin: 0 5px 10px 0;
  overflow: visible;
  padding: 12px 40px;
  text-align: center;
  text-transform: none;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  &:focus {
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    box-shadow: rgba(0, 0, 0, 0.125) 0 3px 5px inset;
    outline: 0;
  }
  &:not([disabled]):active {
    box-shadow:
      #fff 2px 2px 0 0,
      #000 2px 2px 0 1px;
    transform: translate(2px, 2px);
  }
  @media (min-width: 768px) {
    padding: 12px 50px;
  }
`;
