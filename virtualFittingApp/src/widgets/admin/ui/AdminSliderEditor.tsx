import * as S from "@/widgets/admin/ui/css/AdminSliderEditor.css";
import { useBanner } from "@/widgets/admin/hooks/useBanner";
import { ICON_UPLOAD_ICON } from "@/shared/constants";
import { ChangeEvent, useEffect, useRef } from "react";
import { LeftArrow, RightArrow } from "@/shared";

function AdminSliderEditor() {
  const {
    containerRef,
    currIdx,
    photoCount,
    photoList,
    setSlideContainerWidth,
    onClickBanner,
    onAddPhotoCount,
    onSubPhotoCount,
    onMoveBanner,
    onChangePhotos,
    onSubmitBanner,
  } = useBanner();

  useEffect(() => {
    if (containerRef.current) {
      setSlideContainerWidth(
        containerRef.current.getBoundingClientRect().width,
      );
    }
  }, []);

  return (
    <S.Wrapper>
      <S.ButtonContainer>
        <S.Button onClick={onAddPhotoCount}>배너 추가</S.Button>
        <S.Button onClick={onSubPhotoCount}>배너 삭제</S.Button>
      </S.ButtonContainer>
      <S.ImageSliderComponent>
        <S.ArrowContainer>
          <LeftArrow onClick={() => onMoveBanner(false)} />
          <RightArrow onClick={() => onMoveBanner(true)} />
        </S.ArrowContainer>
        <S.SliderContainer photoCount={photoCount} ref={containerRef}>
          {Array.from({ length: photoCount }).map((_, key) => {
            const photoSrc = photoList[key] ?? undefined;
            return (
              <EditSource
                onChange={(e) => onChangePhotos(e, key)}
                photoSrc={photoSrc}
                id={key}
                key={key}
              />
            );
          })}
        </S.SliderContainer>
      </S.ImageSliderComponent>
      <S.DotContainer>
        {Array.from({ length: photoCount }).map((_, key) => {
          return (
            <S.Dot
              isClicked={currIdx === key}
              className="dot"
              key={key}
              onClick={() => onClickBanner(key)}
            />
          );
        })}
      </S.DotContainer>
    </S.Wrapper>
  );
}

export { AdminSliderEditor };

type EditSourceType = {
  id: number;
  photoSrc?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function EditSource({ id, photoSrc, onChange }: EditSourceType) {
  const uploadRef = useRef<HTMLInputElement>(null);

  const onClick = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    } else {
      console.error("[EditSource Component] The uploadRef is not connected.");
    }
  };

  if (photoSrc) {
    return <S.ImageViewer src={photoSrc} alt={`slider-${id}`} />;
  }
  return (
    <S.PhotoUploader onClick={onClick}>
      <S.Icon src={ICON_UPLOAD_ICON} alt="upload-icon" />
      <S.PhotoUploaderInput
        accept="image/*"
        type="file"
        ref={uploadRef}
        onChange={onChange}
      />
    </S.PhotoUploader>
  );
}
