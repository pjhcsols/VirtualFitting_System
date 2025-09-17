import styled from 'styled-components';
import { useLikeList } from '../hooks/use-like-list';
import { LikedProductCard } from '@/entities/product';
import { BREAKPOINTS } from '@/shared';
import alertImg from "@/shared/assets/images/alert-fallback.png";

export function LikeList() {
  const { likedItems, isLoading, error } = useLikeList();

  if (isLoading) return <Wrapper><Message>로딩 중...</Message></Wrapper>;
  if (error) return <Wrapper><Message>오류가 발생했습니다.</Message></Wrapper>;

  if (likedItems.length === 0) {
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
          <LikedProductCard key={index} item={item} />
        ))}
      </Grid>
    </Wrapper>
  );
}


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
