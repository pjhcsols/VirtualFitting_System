import styled from "styled-components";

function ProductSmallCard({ src }: { src: string }) {
  return (
    <Wrapper>
      <InnerClothes src={src} alt="small-card" />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 6vw;
  height: 7.5vw;
  overflow: hidden;
  cursor: pointer;
`;

const InnerClothes = styled.img`
  width: 100%;
  height: 100%;
`;

export { ProductSmallCard };
