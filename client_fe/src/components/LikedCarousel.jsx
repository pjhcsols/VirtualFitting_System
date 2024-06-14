import React from 'react';
import './LikedCarousel.css';

const LikedCarousel = ({ likedItems }) => {
  // 최대 표시할 아이템 개수
  const maxItems = 4;

  // 첫 번째 아이템만 추출
  const firstItem = likedItems[0];

  // 4개 아이템까지만 보이도록 설정
  const itemsToShow = likedItems.slice(0, maxItems);

  // 4개 아이템을 반복하여 요소 생성
  const repeatedItems = itemsToShow.map((item, index) => (
    <div className="liked-item" key={index}>
      <img src={item.productPhotoUrl[0]} alt={`Liked Item ${index + 1}`} />
      <p>{item.productName}</p>
    </div>
  ));

  return (
    <div className="liked-carousel">
      {repeatedItems}
    </div>
  );
};

export default LikedCarousel;
