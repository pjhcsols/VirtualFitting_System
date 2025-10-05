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
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  color: #fff;
`;
