import styled from "styled-components";

function AdminProductPage() {
  return (
    <Wrapper>
      <Title>출고 상품 상세보기</Title>
      <ProductContainer>
        <ProductImageBox>
          <ProductImage src="" alt="product-image" />
        </ProductImageBox>
        <ProductDescriptionBox>
          <Description></Description>
        </ProductDescriptionBox>
      </ProductContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 10px 60px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const Title = styled.h1`
  font-family: "Prata-Regular";
  font-size: 3vw;
  color: black;
`;

const ProductContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  border-radius: 32px;
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
  align-items: center;
`;

const Description = styled.span`
  font-family: "Prata-Regular";
  font-size: 1em;
  font-weight: 500;
  color: black;
`;

export { AdminProductPage };
