/*
 *
 * Enter 키를 눌렀을 경우, 검색
 * GET Method 를 이용해서, Query Parameter 로 인한 검색
 * Type 에서 검색을 하는 End Point 받아와야됨
 *
 */

import styled from "styled-components";
import { ICON_SEARCH } from "../../../constants";
import { KeyboardEvent } from "react";
import { search_product } from "../api/search.action";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const router = useNavigate();

  const onClickSearch = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const res = await search_product("test");
      router("/admin");
    }
  };
  return (
    <Wrapper>
      <SearchIcon src={ICON_SEARCH} alt="search_Icon" />
      <SearchInput />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: fit-content;
`;

const SearchIcon = styled.img`
  position: absolute;
  left: 20px;
  top: 35%;
  width: 1em;
  height: 1em;
`;

const SearchInput = styled.input.attrs({
  type: "text",
  placeholder: "검색어를 입력해주세요.",
  name: "search",
})`
  padding: 5px 5px 5px 50px;
  width: 100%;
  height: 3em;
  border-radius: 8px;
  font-size: 1em;
  border: 1px solid #121212;
  background: transparent;
  color: black;
`;

export { SearchBar };
