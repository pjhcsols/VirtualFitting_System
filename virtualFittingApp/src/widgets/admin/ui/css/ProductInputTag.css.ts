import styled from "styled-components";

export const Wrapper = styled.div`
  z-index: 10;
  width: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

export const UploadContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  .show-text {
    font-size: 1rem;
    color: black;
  }
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

export const UploadedFile = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 12px 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

export const UploadedFileContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
`;

export const FileTag = styled.input.attrs({ type: "file" })`
  display: none;
`;

export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const TitleInputContainer = styled.div`
  position: relative;
  margin: 50px auto;
  width: 80%;
  input[type="text"] {
    font-size: 20px;
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    padding: 5px 0;
    background-color: transparent;
    outline: none;
    color: black;
  }
  label {
    position: absolute;
    top: 0;
    left: 0;
    color: #ccc;
    transition: all 0.3s ease;
    pointer-events: none;
  }
  input[type="text"]:focus ~ .label,
  input[type="text"]:valid ~ .label {
    top: -20px;
    font-size: 16px;
    color: #333;
  }
  .underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background-color: #333;
    transform: scaleX(0);
    transition: all 0.3s ease;
  }
  input[type="text"]:focus ~ .underline,
  input[type="text"]:valid ~ .underline {
    transform: scaleX(1);
  }
`;

export const PalleteContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  .title-text {
    font-family: "Pretendard";
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
  }
  .dots {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const Pallete = styled.div`
  box-sizing: border-box;
  padding: 12px 24px;
  min-width: 120px;
  width: 140px;
  height: 40px;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 4px;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 600;
  color: black;
  cursor: pointer;
`;

export const MaterialContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  .title-text {
    font-family: "Pretendard";
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
  }
  .material-container {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    gap: 4px;
    .material {
      box-sizing: border-box;
      padding: 12px 20px;
      min-width: 100px;
      height: 32px;
      width: 20%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: "Pretendard";
      font-size: 1rem;
      font-weight: 600;
      border: 1px solid black;
      color: black;
      cursor: pointer;
    }
  }
`;
