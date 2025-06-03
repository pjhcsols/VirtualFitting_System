import styled from "styled-components";

export const ModalContainer = styled.div`
  color: #fcfcfc;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.1em;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
`;

export const ModalIcon = styled.img`
  transition: 0.25s all ease-out;
  padding: 8px 12px;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  &:focus,
  &:hover {
    background-color: #d9d9d9;
  }
`;

export const ModalWrapper = styled.section`
  min-height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 2;

  &:not(:target) {
    visibility: hidden;
    transition-delay: 500ms;
    transition-property: visibility;
  }

  &:target .modal-content {
    transform: translateY(100vh);
    animation: 500ms ease-in-out slideUp forwards;
  }

  &:not(:target) .modal-content {
    transform: translateY(0);
    animation: 500ms ease-out slideDown forwards;
  }

  &:target .modal-overlay {
    opacity: 0;
    animation: 500ms linear fadeIn forwards;
  }

  &:not(:target) .modal-overlay {
    opacity: 1;
    animation: 500ms linear fadeOut forwards;
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(100vh);
    }

    to {
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      transform: translateY(0);
    }

    to {
      transform: translateY(100vh);
    }
  }
`;

export const HeaderAnchor = styled.a`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
`;

export const ModalContent = styled.div`
  transition: transform 1s;
  background: #fff;
  width: 75%;
  position: relative;
  margin: auto;
  max-height: 75%;
  overflow-y: scroll;
  padding: 48px 24px;
  border-radius: 4px;
  max-width: 1000px;
`;

export const CloseModalAnchor = styled.a`
  font-size: 36px;
  text-decoration: none;
  color: inherit;
  position: absolute;
  right: 24px;
  top: 10px;
`;

export const Title = styled.h2`
  color: black;
`;
