import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { LikedItem } from "@/shared/components/liked-carousel/types/likedItem";
import { getLikedList } from "@/shared/components/liked-carousel/api/liked.action";
import alertImg from "@/pages/my/ui/alert.png";
import { BREAKPOINTS } from "@/shared";

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
    return (
      <Wrapper>
        <EmptyWrapper>
          <AlertImage src={alertImg} alt="알림 아이콘" />
          <Message>좋아요한 상품이 없습니다.</Message>
        </EmptyWrapper>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Grid>
        {likedItems.map((item, index) => (
          <Card key={index}>
            <Image src={item.productPhotoUrl[0]} alt={item.productName} />
            <ProductName>{item.productName}</ProductName>
          </Card>
        ))}
      </Grid>
    </Wrapper>
  );
}

export { LikeContentList };

const Wrapper = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
    padding: 10px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: ${BREAKPOINTS.sm}px) {
    grid-template-columns: 1fr;
  }
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
  font-family: "Prata-Regular";
  text-align: center;
`;

const Message = styled.p`
  font-size: 20px;
  font-family: "Prata-Regular";
  margin-bottom: 20px;
  color: #d9d9d9;
`;

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
