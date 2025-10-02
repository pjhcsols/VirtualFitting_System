import * as S from "./style";
import { Image } from "lucide-react";

interface IimageCard {
  src: string;
  alt: string;
}

function ImageCard({ src, alt }: IimageCard) {
  if (src && alt) {
    return <S.CarouselImage src={`http://${src}`} alt={alt} />;
  }
  return (
    <S.ImageContainer>
      <Image size={32} />
      <S.Description>사진을 업로드해주세요</S.Description>
      <S.FileInputNoDisplay />
    </S.ImageContainer>
  );
}

export { ImageCard };
