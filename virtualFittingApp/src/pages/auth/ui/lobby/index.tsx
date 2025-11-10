import * as S from "./style";

function AuthLobby() {
  return (
    <S.Wrapper>
      <S.TitleContainer>
        <S.Title>BASILIUM</S.Title>
        <S.SubTitle>회원가입 페이지입니다.</S.SubTitle>
      </S.TitleContainer>
      <S.ContentContainer>
        <S.GlassCardContainer to={"/signup/normal"}>
          <S.Title>일반 유저 회원가입</S.Title>
          <S.Text>상품을 사러오셨나요?</S.Text>
        </S.GlassCardContainer>
        <S.GlassCardContainer to={"/signup/brand"}>
          <S.Title>브랜드 유저 회원가입</S.Title>
          <S.Text>상품을 팔러오셨나요? </S.Text>
        </S.GlassCardContainer>
      </S.ContentContainer>
      <S.HomeButton to={"/"}>
        <S.Text>메인화면으로</S.Text>
      </S.HomeButton>
    </S.Wrapper>
  );
}

export { AuthLobby };
