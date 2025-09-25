import { useEffect, useState } from "react";
import * as S from "./style";
import { BrandUserType } from "@/pages/brand";
import { getNotAllowedBrandUsers } from "../../api/admin.action";
import { Pagination } from "../../components/pagination/index";

function AdminBrandUsers() {
  const headerTexts = [
    "Brand명",
    "Brand 이메일",
    "연락처",
    "Brand 연락처",
    "판매 가능 여부",
  ];

  const [brandUsers, setBrandUsers] = useState<BrandUserType[]>([]);
  const [currentUsers, setCurrentUsers] = useState<BrandUserType[]>([]);

  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const size = 10;
  const indexOfLastItem = page * size;
  const indexOfFirstItem = indexOfLastItem - size;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getNotAllowedBrandUsers();
      setBrandUsers(res.data);
      setTotalPage(Math.ceil(brandUsers.length / size));
      setCurrentUsers(brandUsers.slice(indexOfFirstItem, indexOfLastItem));
    };
    fetchData();
  }, []);

  return (
    <S.Wrapper>
      <S.TextContainer>
        <S.BlueText>총</S.BlueText>
        <S.BlackText>{brandUsers.length} 건</S.BlackText>
      </S.TextContainer>
      <S.PostHeaderColumn>
        {headerTexts.map((item: string, key: number) => {
          return (
            <S.PostHeaderBox key={key}>
              <S.PostHeaderText>{item}</S.PostHeaderText>
            </S.PostHeaderBox>
          );
        })}
      </S.PostHeaderColumn>
      {currentUsers.map((user, key) => {
        return (
          <S.BrandUserColumn>
            <S.PostHeaderBox key={key}>
              <S.PostHeaderText>{user.firmName}</S.PostHeaderText>
            </S.PostHeaderBox>
            <S.PostHeaderBox key={key}>
              <S.PostHeaderText>{user.firmEmail}</S.PostHeaderText>
            </S.PostHeaderBox>
            <S.PostHeaderBox key={key}>
              <S.PostHeaderText>{user.phoneNumber}</S.PostHeaderText>
            </S.PostHeaderBox>
            <S.PostHeaderBox key={key}>
              <S.PostHeaderText>{user.firmPhone}</S.PostHeaderText>
            </S.PostHeaderBox>
            <S.PostHeaderBox key={key}>
              <S.PostHeaderText>{user.saleAllowed}</S.PostHeaderText>
            </S.PostHeaderBox>
          </S.BrandUserColumn>
        );
      })}
      <Pagination totalPage={totalPage} page={page} setPage={setPage} />
    </S.Wrapper>
  );
}

export { AdminBrandUsers };
