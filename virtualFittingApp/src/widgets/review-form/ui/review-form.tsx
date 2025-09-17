import styled from "styled-components";
import { useReviewForm } from '../hooks/use-review-form';
import { ReviewableOrderCard } from "@/entities/order";
import icon_star_filled from "@/shared/assets/icons/icon-star-filled.svg";
import icon_star_unfilled from "@/shared/assets/icons/icon-star-unfilled.svg";
import icon_add from "@/shared/assets/icons/icon-add.svg";
import icon_cancel from "@/shared/assets/icons/icon-cancel.svg";

export function ReviewForm() {
  const {
    order,
    rating,
    setRating,
    reviewText,
    setReviewText,
    photoPreviewImages,
    photoInputRef,
    editReview,
    handlePhotoUploadClick,
    handleImageChange,
    handleRemoveImage,
    handleRegister,
  } = useReviewForm();

  if (!order) {
    return <div>주문 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <GlassForm>
      <FormInner>
        <ReviewableOrderCard order={order} />
        <Divider />
        
        <RatingSection>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarImage
              key={star}
              src={star <= rating ? icon_star_filled : icon_star_unfilled}
              onClick={() => setRating(star)}
            />
          ))}
        </RatingSection>
        
        <ReviewTextWrapper>
          <ReviewLabel>
            본문 입력(필수)<LengthGuide>20자 이상</LengthGuide>
          </ReviewLabel>
          <ReviewTextarea
            placeholder="상품에 대한 의견을 자세히 공유해주세요."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            maxLength={500}
          />
          <CharCount>{reviewText.length}/500</CharCount>
        </ReviewTextWrapper>
        
        <ImageWrapper>
          <ReviewLabel>사진 첨부</ReviewLabel>
          <PictureList>
            {photoPreviewImages.map((image, index) => (
              <PreviewContainer key={index}>
                <PreviewImg src={image} alt={`preview-${index}`} />
                <RemoveButton onClick={() => handleRemoveImage(index)}>
                  <CancelIconImage src={icon_cancel} alt="remove" />
                </RemoveButton>
              </PreviewContainer>
            ))}
            {photoPreviewImages.length < 5 && (
              <UploadBox onClick={handlePhotoUploadClick}>
                <UploadInner>
                  <AddIconImage src={icon_add} alt="add" />
                  <CountText>{photoPreviewImages.length}/5</CountText>
                </UploadInner>
              </UploadBox>
            )}
          </PictureList>
          <HiddenInput
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            ref={photoInputRef}
          />
        </ImageWrapper>
      </FormInner>

      <FooterInner>
        <RegisterButton onClick={handleRegister}>
          {editReview ? "리뷰 수정하기" : "리뷰 등록하기"}
        </RegisterButton>
      </FooterInner>
    </GlassForm>
  );
}

export const GlassForm = styled.div`
  width: 100%;
  max-width: 800px;
  border-radius: 18px;
  padding: 20px;
  overflow: hidden;
  margin-top: 35px;
  background: rgba(200, 200, 200, 0.15);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 30px rgba(0, 0, 0, 0.15);
`;

export const FormInner = styled.div`
  width: 100%;
  margin: 0 auto;
`;

export const FooterInner = styled.div`
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
`;

export const Divider = styled.hr`
  margin: 24px 0;
  border: none;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.5);
  width: 100%;
`;

export const RatingSection = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  width: 100%;
`;

export const StarImage = styled.img`
  width: 35px;
  height: 35px;
  cursor: pointer;
  object-fit: contain;
`;

export const ReviewTextWrapper = styled.div`
  width: 100%;
  margin-top: 35px;
`;

export const ImageWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

export const ReviewLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-family: "Prata-Regular";
  margin-bottom: 6px;
  width: 100%;
  color: rgba(255,255,255,0.9);
`;

export const LengthGuide = styled.span`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgba(255,255,255,0.6);
`;

export const ReviewTextarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-family: "Prata-Regular";
  background: rgba(200, 200, 200, 0.15);
  color: #fff;
  resize: none;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(255,255,255,0.5);
  }
`;

export const CharCount = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgba(255,255,255,0.6);
  margin-top: 4px;
  text-align: right;
  width: 100%;
`;

export const RegisterButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #292E49;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-family: "Prata-Regular";
  cursor: pointer;
  
  &:hover {
    background-color: #3a416a;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const PictureList = styled.div`
  display: flex;
  gap: 8px;
`;

export const PreviewContainer = styled.div`
  position: relative;
  width: 105px;
  height: 140px;
  border-radius: 4px;
  overflow: hidden;
`;

export const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.5);
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const UploadBox = styled.div`
  width: 105px;
  height: 140px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255,255,255,0.9);
  background: rgba(200, 200, 200, 0.15);
  cursor: pointer;
`;

export const UploadInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const CountText = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
`;

export const AddIconImage = styled.img`
  width: 20px;
  height: 20px;
`;

export const CancelIconImage = styled.img`
  width: 12px;
  height: 12px;
`;

