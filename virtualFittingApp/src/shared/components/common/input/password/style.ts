import styled from "styled-components";

export const InfoBox = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const InputContainer = styled.div<{ inputed: boolean }>`
  position: relative;
  margin: 2.5rem auto;
  width: 100%;

  input[type="password"] {
    font-size: 20px;
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    padding: 5px 0;
    background-color: transparent;
    outline: none;
    color: white;
  }
  input[type="text"] {
    font-size: 20px;
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    padding: 5px 0;
    background-color: transparent;
    outline: none;
    color: white;
  }
  label {
    position: absolute;
    top: ${(props) => (props.inputed ? "-20px" : "0")};
    left: 0;
    color: #ccc;
    transition: all 0.3s ease;
    pointer-events: none;
  }
  input[type="password"]:focus ~ .label,
  input[type="password"]:valid ~ .label {
    top: -20px;
    font-size: 16px;
    color: #ccc;
  }
  input[type="text"]:focus ~ .label,
  input[type="text"]:valid ~ .label {
    top: -20px;
    font-size: 16px;
    color: #ccc;
  }
  .underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background-color: #ccc;
    transform: scaleX(0);
    transition: all 0.3s ease;
  }
  input[type="password"]:focus ~ .underline,
  input[type="password"]:valid ~ .underline {
    transform: scaleX(1);
  }
  input[type="text"]:focus ~ .underline,
  input[type="text"]:valid ~ .underline {
    transform: scaleX(1);
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  top: 2.3rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #6b7280;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #667eea;
  }

  &:focus {
    outline: none;
    color: #667eea;
  }
`;

export const EyeIcon = styled.svg`
  width: 20px;
  height: 20px;
  transition: opacity 0.2s ease;
`;
