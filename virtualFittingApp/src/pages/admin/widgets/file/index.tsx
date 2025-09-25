import * as S from "./style";

import { type TBanner } from "../../types/Banner";
import { FilePlus, PencilLine, Trash2 } from "lucide-react";
import { BlackText, BlueText } from "../../components/common/Text";
import { useRef } from "react";

interface IBannerFileUpload {
  images: TBanner[];
}

function BannerFileUploadList({ images }: IBannerFileUpload) {
  const addFileRef = useRef<HTMLInputElement>(null);

  const onClickAddFile = () => {
    if (!addFileRef.current) return;
    addFileRef.current.click();
  };

  return (
    <S.Wrapper>
      <S.InfoContainer>
        <S.CountContainer>
          <BlueText>총</BlueText>
          <BlackText>{images.length}건</BlackText>
        </S.CountContainer>
        <S.PlusButton onClick={onClickAddFile}>
          <FilePlus size={20} color="white" />
          <S.WhiteText>배너 추가</S.WhiteText>
        </S.PlusButton>
        <S.NoDisplayFileInput ref={addFileRef} />
      </S.InfoContainer>
      <S.HeaderColumn>
        <S.ColumnText>No.</S.ColumnText>
        <S.ColumnText>URL</S.ColumnText>
        <S.ColumnText>조작</S.ColumnText>
      </S.HeaderColumn>
      {images.map((item: TBanner, key: number) => {
        return (
          <>
            <S.ColumnWrapper key={key}>
              <S.ColumnBox>
                <S.Text>{key + 1}</S.Text>
              </S.ColumnBox>
              <S.ColumnBox>
                <S.Text>{`http://${item.url}`}</S.Text>
              </S.ColumnBox>
              <S.ColumnBox>
                <S.ButtonBox>
                  <PencilLine size={20} color="black" />
                </S.ButtonBox>
                <S.ButtonBox>
                  <Trash2 size={20} color="black" />
                </S.ButtonBox>
              </S.ColumnBox>
            </S.ColumnWrapper>
            <S.Divider />
          </>
        );
      })}
    </S.Wrapper>
  );
}

export { BannerFileUploadList };
