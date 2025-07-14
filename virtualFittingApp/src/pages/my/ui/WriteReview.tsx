import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import type { OrderItem } from "../types/order";
import { orderDummyData } from "@/pages/my/constants/dummy/dummyData";
import { MyHeader } from "@/shared/components/header";
import alertImg from "@/pages/my/ui/alert.png";
import { STAR_EMPTY_ICON, STAR_FILLED_ICON, ADD_ICON, CANCEL_ICON } from "@/pages/my/constants";
import type { ReviewData } from "../types/review";
import { BREAKPOINTS } from "@/shared";

function StyleReview() {
    const navigate = useNavigate();
    const location = useLocation();
    const editReview: ReviewData | undefined = location.state?.reviewData;

    const { id } = useParams();
    const [order, setOrder] = useState<OrderItem | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>("");
    const photoInputRef = useRef<HTMLInputElement | null>(null);  
    const [photoPreviewImages, setPhotoPreviewImages] = useState<string[]>([]);

    useEffect(() => {
        const foundOrder = orderDummyData.find((item) => item.id === id);
        setOrder(foundOrder || null);

        if (editReview) {
            setRating(editReview.rating);
            setReviewText(editReview.reviewText);
            setPhotoPreviewImages(editReview.photos || []);
        }
    }, [id, editReview]);

    const handleUpPhotoButton = () => {
        photoInputRef.current?.click();
    }; 

    const handleMultipleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);

        fileArray.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setPhotoPreviewImages(prev => [...prev, reader.result as string].slice(0, 5));
                }
            };
            reader.readAsDataURL(file);
        });

        e.target.value = "";
    };

    const handleRemoveImage = (index: number) => {
        setPhotoPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRegister = () => {
        if (!order) {
            alert("등록할 수 없습니다.")
            return;
        }

        const existingReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
        const newReview: ReviewData = {
            id: order.id,
            brand: order.brand,
            productName: order.productName,
            option: order.options,
            rating,
            reviewText,
            photos: photoPreviewImages,
            date: new Date().toISOString()
        };

        const updatedReviews = editReview
            ? existingReviews.map((r: ReviewData) =>
                r.id === editReview.id ? newReview : r
              )
            : [...existingReviews, newReview];
        localStorage.setItem("reviews", JSON.stringify(updatedReviews));
        alert(editReview ? "리뷰가 수정되었습니다!" : "리뷰가 등록되었습니다!");
        navigate("/myPage/review");
    };


    if (!order) {
        return <div>주문 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <PageWrapper>
            <HeaderWrapper>
                <MyHeader title="스타일 리뷰" />
            </HeaderWrapper>

            <ContentWrapper>
                <FormInner>
                    <OrderCard>
                        <ImageBox src={order.productImageUrl || alertImg} alt="상품 이미지" />
                        <RightSection>
                        <TitleLine>
                            <Brand>{order.brand}</Brand>
                        </TitleLine>
                        <ProductName>{order.productName}</ProductName>
                        <OptionText>
                            {order.options.color} / {order.options.size} / {order.options.quantity}개
                        </OptionText>
                        </RightSection>
                    </OrderCard>

                    <RatingSection>
                        {[1, 2, 3, 4, 5].map((star) => (
                        <StarImage
                            key={star}
                            src={star <= rating ? STAR_FILLED_ICON : STAR_EMPTY_ICON}
                            onClick={() => setRating(star)}
                        />
                        ))}
                    </RatingSection>

                    <Divider />

                    <ReviewSize>
                        <ReviewLabel>신체 사이즈</ReviewLabel>
                        <SizeForm>
                        <SizeInput placeholder="키   cm" />
                        <SizeInput placeholder="몸무게 kg" />
                        </SizeForm>
                    </ReviewSize>

                    <ReviewTextWrapper>
                        <ReviewLabel>
                            본문 입력(필수)<LengthGuide>20자 이상</LengthGuide>
                        </ReviewLabel>

                        <ReviewTextarea
                            placeholder="다른 회원들이 도움받을 수 있도록 상품에 대한 의견을 자세히 공유해주세요."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            maxLength={500}
                        />
                        <CharCount>{reviewText.length}/500</CharCount>
                    </ReviewTextWrapper>

                    <ImageWrapper>
                        <ReviewLabel>사진 첨부 (필수)</ReviewLabel>

                        <PictureList>
                        {photoPreviewImages.map((image, index) => (
                            <PreviewContainer key={index}>
                            <PreviewImg src={image} alt={`preview-${index}`} />
                            <RemoveButton onClick={() => handleRemoveImage(index)}>
                                <CancelIconImage src={CANCEL_ICON} alt="remove" />
                            </RemoveButton>
                            </PreviewContainer>
                        ))}

                        {photoPreviewImages.length < 5 && (
                            <UploadBox onClick={handleUpPhotoButton}>
                            <UploadInner>
                                <AddIconImage src={ADD_ICON} alt="add" />
                                <CountText>{photoPreviewImages.length}/5</CountText>
                            </UploadInner>
                            </UploadBox>
                        )}
                        </PictureList>

                        <GuideWrapper>
                            <ImageGuide>1장 이상</ImageGuide>
                        </GuideWrapper>

                        <HiddenInput
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultipleImageChange}
                        ref={photoInputRef}
                        />
                    </ImageWrapper>
                </FormInner>
            </ContentWrapper>

            <FooterWrapper>
                <FooterInner>
                    <RegisterButton onClick={handleRegister}>등록하기</RegisterButton>
                </FooterInner>
            </FooterWrapper>
        </PageWrapper>
    );
}

export { StyleReview };


const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  min-height: 100vh;
  overflow-x: hidden;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
`;

const ContentWrapper = styled.div`
  padding: 100px 20px 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding-bottom: 70px;
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;

  @media (max-width: ${BREAKPOINTS.md}px) {
    max-width: 100%;
    padding: 88px 16px 20px;
  }
`;

const FormInner = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const FooterWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  z-index: 100;
`;

const FooterInner = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 10px 20px;
  border-top: 1px solid #F2F3F5;
  box-sizing: border-box;
`;

const OrderCard = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  width: 100%;
  max-width: 800px;
`;

const ImageBox = styled.img`
  width: 78px;
  height: 90px;
  background-color: #d9d9d9;
  border-radius: 10px;
  object-fit: cover;
  background-position: center;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const TitleLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Brand = styled.div`
  font-weight: bold;
  font-family: "Prata-Regular";
  font-size: 14px;
`;

const ProductName = styled.div`
  font-size: 14px;
  font-family: "Prata-Regular";
  margin-top: 15px;
  text-align: left;
`;

const OptionText = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgb(150, 150, 150);
  text-align: left;
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  height: 1px;
  background-color: #e5e5e5;
  width: 100%;
  max-width: 800px;
`;

const RatingSection = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 800px;
`;

const StarImage = styled.img`
  width: 35px;
  height: 35px;
  cursor: pointer;
  object-fit: contain;
`;

const ReviewTextWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 35px;
`;

const ReviewSize = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 15px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
`;

const SizeForm = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  width: 300px;
  padding: 10px;
  border: 1px solid rgb(228, 230, 233);
  background: rgb(255, 255, 255);
  border-radius: 6px;
  font-size: 14px;

  &::placeholder {
    color: rgb(150, 150, 150);
    font-weight: normal;
  }
`;

const SizeInput = styled(Input)`
  flex: none;
  width: 50px;
  text-align: center;
  font-size: 12px;
  font-family: "Prata-Regular";
`;

const ReviewLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-family: "Prata-Regular";
  margin-bottom: 6px;
  width: 100%;
  max-width: 800px;
`;

const LengthGuide = styled.span`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgb(150, 150, 150);
  white-space: nowrap;
`;

const GuideWrapper = styled.div`
  margin-top: 4px;
  display: flex;
  justify-content: flex-start;
`;

const ImageGuide = styled.span`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgb(150, 150, 150);
  margin-bottom: 30px;
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  max-width: 750px;
  min-height: 150px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: "Prata-Regular";
  resize: none;
  outline: none;

  &::placeholder {
    color: #bbb;
  }
`;

const CharCount = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgb(150, 150, 150);
  margin-top: 4px;
  text-align: right;
  width: 100%;
  max-width: 800px;
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #d9d9d9;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-family: "Prata-Regular";
  &:hover {
    background-color: #000000;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PictureList = styled.div`
  display: flex;
  gap: 8px;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 105px;
  height: 140px;
  border: 1px solid #e4e6e9;
  border-radius: 4px;
  overflow: hidden;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 2px;
  right: 8px;
  background: transparent;
  border: none;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const UploadBox = styled.div`
  width: 100px;
  height: 140px;
  border: 1px solid #e4e6e9;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #bbb;
  cursor: pointer;
  position: relative;
`;

const UploadInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const CountText = styled.div`
  font-size: 12px;
  font-family: "Prata-Regular";
  color: rgb(150, 150, 150);
`;

const AddIconImage = styled.img`
  width: 20px;
  height: 20px;
`;

const CancelIconImage = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;