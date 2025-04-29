import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  width: 350px;
  height: 550px;
  display: flex;
  flex-flow: column wrap;
  border-radius: 2px;
  border: 1px solid #121212;
  transition: 0.4s all ease-out;
  background-color: transparent;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  cursor: pointer;
  gap: 32px;
`;

export const ProductImg = styled.img`
  width: 350px;
  height: 437.5px;
`;

export const ProductInfoContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 12px 20px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const ProductTitle = styled.span`
  font-family: "Pretendard";
  font-size: 1rem;
  color: black;
`;

export const ProductSubOption = styled.div`
  box-sizing: border-box;
  padding: 4px 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProductColorPalleteBox = styled.div`
  width: 50%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

export const ProductColorPallete = styled.div<{ pallete?: string }>`
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background-color: ${(props) => props.pallete ?? "#121212"};
`;

export const ProductPrice = styled(ProductTitle)`
  font-size: 0.9rem;
`;
