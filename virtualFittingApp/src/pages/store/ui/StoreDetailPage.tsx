import styled from "styled-components";

function StoreDetailPage() {
  return (
    <Wrapper>
      <ProductContainer>
        <ProductImageBox>
          <ProductImage src="" alt="product-image" />
        </ProductImageBox>
        <ProductDescriptionBox>
          <DescriptionBox>
            <BrandTitle>BASILIUM</BrandTitle>
            <Description>10% OFF</Description>
          </DescriptionBox>
          <DescriptionBox>
            <ProductTitle>ONE-TUCK WIDE SWEAT PANTS [BLACK]</ProductTitle>
          </DescriptionBox>
        </ProductDescriptionBox>
      </ProductContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 40px 60px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const ProductContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;

const ProductImageBox = styled.div`
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 30vw;
  height: 45vw;
  border-radius: 24px;
  background: #7f7f7f 50%;
  box-shadow: 0px 20px 20px 0 rgb(0, 0, 0, 0.25);
`;

const ProductDescriptionBox = styled.div`
  box-sizing: border-box;
  padding: 10px 32px;
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const DescriptionBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 13vw;
`;

const BrandTitle = styled.h1`
  font-family: "Prata-Regular";
  font-size: 2vw;
  color: black;
`;

const ProductTitle = styled.p`
  font-family: "Prata-Regular";
  font-size: 1.5vw;
  color: black;
`;

const Description = styled.p`
  font-family: "Prata-Regular";
  font-size: 1vw;
  font-weight: 500;
  color: black;
`;

export { StoreDetailPage };
