import styled from "styled-components";

export const InputContainer = styled.div<{ inputed: boolean }>`
  position: relative;
  margin: 2.5rem auto;
  width: 100%;

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
  input[type="text"]:focus ~ .underline,
  input[type="text"]:valid ~ .underline {
    transform: scaleX(1);
  }
`;
