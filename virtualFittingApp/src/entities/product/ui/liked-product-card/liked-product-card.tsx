import styled from 'styled-components';
import type { LikedItem } from "@/entities/like";

type Props = { item: LikedItem };

export function LikedProductCard({ item }: Props) {
  return (
    <Card>
      <Image src={item.productPhotoUrl[0]} alt={item.productName} />
      <ProductName>{item.productName}</ProductName>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
`;

const ProductName = styled.p`
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  font-family: "Prata-Regular";
  text-align: center;
`;
