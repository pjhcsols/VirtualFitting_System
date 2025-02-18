import styled from "styled-components";

function ProductSmallCard({ src }: { src: string }) {
  return (
    <Wrapper>
      <InnerClothes src={src} alt="small-card" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 5vw;
  height: 7.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: #cfcfcf;
  overflow: hidden;
  cursor: pointer;
`;

const InnerClothes = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export { ProductSmallCard };
