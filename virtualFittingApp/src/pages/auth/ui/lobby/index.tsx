import * as S from "./style";

import { PrataText } from "@/shared";

function AuthLobby() {
  return (
    <S.Wrapper>
      <S.TitleContainer>
        <PrataText size={24} $weight={500} color="black">
          BASILIUM
        </PrataText>
        <S.SubTitle>회원가입 페이지입니다.</S.SubTitle>
      </S.TitleContainer>
      <S.ContentContainer>
        <S.SignUpGuideContainer to={"/signup/normal"}>
          <span className="title">일반 유저</span>
          <span className="desc">상품을 사러오셨나요? 탁월한 선택이세요!</span>
          <S.TShirt />
        </S.SignUpGuideContainer>
        <S.SignUpGuideContainer to={"/signup/brand"}>
          <span className="title">브랜드 유저</span>
          <span className="desc">
            상품을 팔러오셨나요? 그러면 여기를 클릭해주세요!
          </span>
        </S.SignUpGuideContainer>
      </S.ContentContainer>
    </S.Wrapper>
  );
}

export { AuthLobby };
