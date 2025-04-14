import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 32px;
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
