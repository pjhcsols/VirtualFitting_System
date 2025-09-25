import styled from "styled-components";

export const AlarmContainer = styled.div<{ visible: boolean }>`
  margin: 0 auto;
  position: fixed;
  bottom: 0;
  width: 324px;
  height: 84px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-radius: 4px;
  background-color: #111111;
  transition: 0.2s all cubic-bezier(0.165, 0.84, 0.44, 1);
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: ${(props) =>
    props.visible ? "translateY(-168px)" : "translateY(0)"};
`;

export const Text = styled.span<{ error: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.error ? "#f68181ff" : "#fffafa")};
`;

export const Button = styled.button`
  width: 32px;
  background-color: #fffafa;
  border-radius: 8px;
  color: #111111;
  font-size: 16px;
  font-weight: 700;
`;
