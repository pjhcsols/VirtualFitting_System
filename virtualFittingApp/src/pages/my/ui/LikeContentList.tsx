import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { LikedItem } from "@/shared/components/liked-carousel/types/likedItem";
import { getLikedList } from "@/shared/components/liked-carousel/api/liked.action";
import alertImg from "@/pages/my/ui/alert.png";

function LikeContentList() {
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);

  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        const data = await getLikedList(); 
        setLikedItems(data);
      } catch (error) {
        console.error("좋아요 목록 불러오기 실패", error);
      }
    };
    fetchLikedItems();
  }, []);

  if (!likedItems.length) {
    return(
        <EmptyWrapper>
            <AlertImage src={alertImg} alt="알림 아이콘" />
            <Message>좋아요한 상품이 없습니다.</Message>
        </EmptyWrapper>
    )
  }

  return (
    <Grid>
      {likedItems.map((item, index) => (
        <Card key={index}>
          <Image src={item.productPhotoUrl[0]} alt={item.productName} />
          <ProductName>{item.productName}</ProductName>
        </Card>
      ))}
    </Grid>
  );
}

export { LikeContentList };

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

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
  text-align: center;
`;

const Message = styled.p`
    font-size: 20px;
    margin-bottom: 20px;
    color: #d9d9d9;
`

const EmptyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 70px;
`;

const AlertImage = styled.img`
    width: 80px;
    height: 80px;
`;
