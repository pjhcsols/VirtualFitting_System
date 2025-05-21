import styled from "styled-components";

export const InputBox = styled.div`
  position: relative;
  width: 400px;
  &:nth-child(2) input:valid ~ span,
  &:nth-child(2) input:focus ~ span {
    background-color: #00dfc4;
    color: #1d2b3a;
    border-radius: 2px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #121212;
  border-radius: 5px;
  outline: none;
  background-color: #fffafa;
  color: #121212;
  font-size: 0.8em;

  &:valid ~ span,
  &:focus ~ span {
    color: #121212;
    transform: translateX(10px) translateY(-7px);
    font-size: 0.65em;
    padding: 0 10px;
    background-color: #fffafa;
    border-left: 1px solid #00dfc4;
    border-right: 1px solid #00dfc4;
    letter-spacing: 0.2em;
  }

  &:valid,
  &:focus {
    border: 1px solid #00dfc4;
  }
`;

export const Title = styled.span`
  position: absolute;
  left: 0;
  padding: 10px;
  pointer-events: none;
  font-size: 0.8em;
  color: #121212;
  text-transform: uppercase;
  transition: 0.5s all ease;
`;
