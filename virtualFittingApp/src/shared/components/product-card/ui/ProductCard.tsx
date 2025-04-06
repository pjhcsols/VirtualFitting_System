import styled from "styled-components";

function ProductCard({ product }: { product: any }) {
  return (
    <Card>
      <ImageBox>
        <img src={product.image} alt={product.name} />
      </ImageBox>
      <InfoBox>
        <Name>{product.name}</Name>
        <Price>￦{product.price}</Price>
      </InfoBox>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageBox = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid black;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoBox = styled.div`
  padding: 0.5em 0;
  border: 1px solid black;
`;

const Name = styled.div`
  font-size: 1em;
  font-weight: 500;
  color: black;

`;

const Price = styled.div`
  font-size: 0.9em;
  color: black;
`;

export { ProductCard };
