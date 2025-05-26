import * as S from "@/widgets/admin/ui/css/AdminSliderEditor.css";
import { useState } from "react";

function AdminSliderEditor() {
  const [photoCount, setPhotoCount] = useState<number>(1);
  const [photoList, setPhotoList] = useState<string[]>([]);

  return (
    <S.Wrapper>
      <S.ButtonContainer>
        <S.Button>배너 추가</S.Button>
        <S.Button>배너 삭제</S.Button>
      </S.ButtonContainer>
      <S.ImageSliderComponent>
        <S.SliderContainer photoCount={photoCount}>
          {Array.from({ length: photoCount }).map((_, key) => {
            if (photoList.length >= key) {
              return <EditSource photoSrc={undefined} key={key} />;
            }
            return <EditSource photoSrc={photoList[key]} key={key} />;
          })}
        </S.SliderContainer>
      </S.ImageSliderComponent>
      <S.DotContainer>
        {Array.from({ length: photoCount }).map((_, key) => {
          return <div className="dot" key={key} />;
        })}
      </S.DotContainer>
    </S.Wrapper>
  );
}

export { AdminSliderEditor };

type EditSourceType = {
  key: number;
  photoSrc?: string;
};

function EditSource({ key, photoSrc }: EditSourceType) {
  if (photoSrc) {
    return <S.ImageViewer src={photoSrc} alt={`slider-${key}`} key={key} />;
  }
  return (
    <S.PhotoUploader>
      <S.IconContainer>
        <S.Icon></S.Icon>
        <S.Icon></S.Icon>
      </S.IconContainer>
    </S.PhotoUploader>
  );
}
