import { styled } from "styled-components";

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
  transition: 0.3s all cubic-bezier(0.165, 0.84, 0.44, 1);
  &:hover {
    background-color: #d9d9d9;
  }
`;

export const FileInputNoDisplay = styled.input.attrs({ type: "file" })`
  display: none;
`;

export const Description = styled.span`
  font-size: 24px;
  font-weight: 500;
  color: #111111;
`;

export const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;
