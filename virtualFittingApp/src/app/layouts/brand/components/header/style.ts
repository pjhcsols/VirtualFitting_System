import styled from "styled-components";

export const Wrapper = styled.header`
  box-sizing: border-box;
  padding: 12px 140px;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #111111;
`;

export const LogoContainer = styled.div`
  width: 280px;
  height: 48px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

export const ContentContainer = styled.div`
  box-sizing: border-box;
  padding: 8px 40px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
`;

export const ContentBox = styled.div`
  box-sizing: border-box;
  padding: 10px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  transition: 0.2s all ease-out;
  &:hover {
    background-color: #c8c8c8;
  }
  span {
    font-size: 16px;
    font-weight: 600;
    color: black;
  }
`;

export const ProfileWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 100%;
  border: 1px solid #121519;
  overflow: hidden;
  transition: 0.2 all ease-out;
  &:hover {
    transform: translateY(-4px);
  }
`;

export const LogoutButton = styled.div`
  box-sizing: border-box;
  padding: 8px 16px;
  width: 120px;
  height: 48px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 8px;
  transition: 0.2s all ease-out;
  &:hover {
    transform: scale(1.01);
    background-color: #d9d9d9;
  }
  span {
    font-size: 16px;
    font-weight: 600;
    color: black;
  }
`;
