import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import type { OrderItem } from "../types/order";
import { orderDummyData } from "@/pages/my/constants/dummy/dummyData";
import { MyHeader } from "@/shared/components/header";
import alertImg from "@/pages/my/ui/alert.png";
import { STAR_EMPTY_ICON, STAR_FILLED_ICON, CAMERA_ICON } from "@/pages/my/constants";
import { handleImageFileChange } from "@/pages/my";

function StyleReview() {
    const { id } = useParams();
    const [order, setOrder] = useState<OrderItem | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>("");
    const photoInputRef = useRef<HTMLInputElement | null>(null);  
    const [photoPreviewImage, setPhotoPreviewImage] = useState<string | null>(null);
    const [photoImageFile, setPhotoImageFile] = useState<File | null>(null);

    useEffect(() => {
        const found = orderDummyData.find((item) => item.id === id);
        setOrder(found || null);
    }, [id]);

    const handleUpPhotoButton = () => {
        photoInputRef.current?.click();
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

                <Divider/>

                <ReviewTextWrapper>
                    <ReviewLabel>
                        본문 입력(필수)
                        <LengthGuide>20자 이상</LengthGuide>
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
                    <ReviewLabel>사진 첨부(필수)</ReviewLabel>
                    <PictureBox htmlFor="imageUpload">
                        {photoPreviewImage ? (
                            <PreviewImg src={photoPreviewImage} alt="미리보기" />
                    ) : (
                            <CameraImg src={CAMERA_ICON} onClick={handleUpPhotoButton} alt="카메라 아이콘" />
                    )}
                    </PictureBox>
                    <HiddenInput 
                        type="file" 
                        id="photoUpload" 
                        accept="image/*" 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageFileChange(e, setPhotoPreviewImage, setPhotoImageFile)}
                        ref={photoInputRef} />
                </ImageWrapper>

            </ContentWrapper>

            <FooterWrapper>
              <RegisterButton>등록하기</RegisterButton>
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
`;

const HeaderWrapper = styled.div`
    position: sticky;
    top: 0;
    z-index: 100;
`;

const ContentWrapper = styled.div`
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    width: 100%;
    flex-grow: 1;
`;

const FooterWrapper = styled.div`
      flex-shrink: 0;
      position: sticky;
      bottom: 0;
      background: #fff;
      padding: 10px 0;
      border-top: 1px solid #F2F3F5;
      display: flex;
      justify-content: center;

      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      
  `;

const OrderCard = styled.div`   
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    width: 560px;   
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
    font-size: 14px;
`;

const ProductName = styled.div`
    font-size: 14px;
    margin-top: 15px;
    text-align: left;
`;

const OptionText = styled.div`
    font-size: 12px;
    color: rgb(150, 150, 150);
    text-align: left;
`;

const Divider = styled.hr`
    margin: 16px 0;
    border: none;
    height: 1px;
    background-color: #e5e5e5;
    width: 560px;
    max-width: 100%;
`;

const RatingSection = styled.div`
    display: flex;
    justify-content: flex-start;  
    align-items: center;
    gap: 6px;
    width: 100%;
    max-width: 560px;
`;

const StarImage = styled.img`
    width: 35px;
    height: 35px;
    cursor: pointer;
    object-fit: contain;
    display: inline-block;
`;

const ReviewTextWrapper = styled.div`
  width: 100%;
  max-width: 560px;
  margin-top: 24px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 560px;
  margin-top: 24px;
`;

const ReviewLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 6px;
  width: 100%;
  max-width: 560px;
`;

const LengthGuide = styled.span`
  font-size: 12px;
  color: rgb(150, 150, 150);
  white-space: nowrap;
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  max-width: 540px;
  min-height: 120px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  resize: none;
  outline: none;

  &::placeholder {
    color: #bbb;
  }
`;

const CharCount = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 4px;
  text-align: right;
  width: 100%;
  max-width: 560px;
`;

const RegisterButton = styled.button`
    width: 100%;
    max-width: 550px;
    padding: 12px;
    background-color: #d9d9d9;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;

    &:hover {
      background-color: #000000; 
    }
  `;

  const PictureBox = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 180px;
    border: 1px solid #e4e6e9;
    cursor: pointer;
    margin-bottom: 30px;
  `;

  const CameraImg = styled.img`
    width: 40px;
    height: 40px;
  `;

  const PreviewImg = styled.img`
      width: 100%;
      height: 100%;
      object-fit: cover;
  `;


  const HiddenInput = styled.input`
    display: none;
  `;