import styled from "styled-components";
import type { ProductDetail } from "@/entities/product"; 

interface ProductDescriptionProps {
  product: ProductDetail;
}

function ProductDescription({ product }: ProductDescriptionProps) {
  const subImageUrls = product.productImages?.productSubPhotoUrls || [];

  return (
    <Wrapper>
      <DetailContainer>
        <SubImagesList>
          {subImageUrls.map((url, index) => (
              <DetailImage 
                key={index} 
                src={url} 
                alt={`${product.productName} 상세 이미지 ${index + 1}`} 
              />
            ))}
        </SubImagesList>
        
      </DetailContainer>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center; 
`;

const DetailContainer = styled.div`
  padding: 64px 0px;
  display: flex;
  flex-flow: column nowrap;
  max-width: 1200px; 
  width: 100%;
`;

const SubImagesList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  align-items: center;
`;

const DetailImage = styled.img`
  width: 100%;
  max-width: 600px; 
  height: auto;
  display: block;
  object-fit: contain;
`;


export { ProductDescription };