import { DragAndDropFile, FileItem } from "@/shared";
import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  GET_BRAND_AUTHENTICATION,
  POST_BRAND_AUTHENTICATION,
} from "../api/brand.action";
import { BrandAuthenticationType } from "../types/brandUser";

function BrandAuthenticate() {
  const [file, setFile] = useState<FileItem[]>([]);
  const [authenticationData, setAuthenticationData] =
    useState<BrandAuthenticationType>({
      timestamp: "",
      status: 0,
      code: "",
      message: "",
      data: {
        userNumber: 0,
        busniessRegistration: "",
        fileName: "",
        url: "",
      },
    });

  useEffect(() => {
    const fetchData = async () => {
      const data = await GET_BRAND_AUTHENTICATION();
      if (!data) throw new Error("저장되어 있는 정보가 없습니다.");
    };
    fetchData();
  }, []);

  const onUpload = async () => {
    if (!file) {
      alert("파일을 등록해주세요!");
      return;
    }
    const res = await POST_BRAND_AUTHENTICATION(file[0]);
    if (res === true) {
    }
  };

  return (
    <Wrapper>
      <TitleContainer>
        <Title>사업자 인증 화면</Title>
        <SubTitle>
          Basilium 쇼핑몰에 상품을 입점하기 위해서는 사업자 등록증에 관련하여
          인증이 필요합니다.
        </SubTitle>
      </TitleContainer>
      <ContentContainer>
        <DragAndDropFile files={file} setFiles={setFile} />
      </ContentContainer>
      <ButtonContainer>
        <Button onClick={onUpload}>
          <Text>제출하기</Text>
        </Button>
      </ButtonContainer>
    </Wrapper>
  );
}

export { BrandAuthenticate };

const Wrapper = styled.main`
  width: 100%;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Title = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  color: black;
`;

const SubTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
`;

const ContentContainer = styled.div`
  width: 100%;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.div`
  width: 20rem;
  height: 2rem;
  transition: 0.15s all ease;
  border: 1px solid #121512;
  border-radius: 0.8rem;
  cursor: pointer;
  &:hover {
    background-color: #d9d9d9;
  }
`;

const Text = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
  color: black;
`;
