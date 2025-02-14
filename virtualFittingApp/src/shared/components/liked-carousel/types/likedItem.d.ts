export interface LikedItem {
    productPhotoUrl: string[]; // 이미지 URL 배열
    productName: string;
  }

  export interface LikedCarouselProps {
    likedItems: LikedItem[]; // likedItems는 LikedItem 배열
  }