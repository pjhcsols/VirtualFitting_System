import styled from "styled-components";

export const FileContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

export const FileUploader = styled.div`
  border: none;
  display: flex;
  padding: 0.75rem 1.5rem;
  background-color: #488aec;
  color: #ffffff;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;
  vertical-align: middle;
  align-items: center;
  border-radius: 0.5rem;
  user-select: none;
  gap: 0.75rem;
  box-shadow:
    0 4px 6px -1px #488aec31,
    0 2px 4px -1px #488aec17;
  transition: all 0.6s ease;

  &:hover {
    box-shadow:
      0 10px 15px -3px #488aec4f,
      0 4px 6px -2px #488aec17;
  }

  &:focus,
  &:active {
    opacity: 0.85;
    box-shadow: none;
  }

  & svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const ShowFile = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 12px 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: black;
  border: 1px solid black;
  border-radius: 2px;
`;

export const ButtonContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 1/2;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const DeleteButton = styled.div`
  width: 50px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  cursor: pointer;
  background-color: #ff6f6f;
  font-family: "Prata-Regular";
  font-size: 12px;
  color: white;
  z-index: 10;
`;

export const UploadButton = styled(DeleteButton)`
  background-color: #98bfff;
`;

export const FileTag = styled.input.attrs({ type: "file" })`
  display: none;
`;
