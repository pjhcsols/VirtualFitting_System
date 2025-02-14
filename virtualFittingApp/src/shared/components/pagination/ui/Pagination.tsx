import styled from "styled-components";
import { ICON_LEFT_ARROW, ICON_RIGHT_ARROW } from "../../../constants";
import { PaginationType } from "../types/pagination";
import { useNavigate } from "react-router-dom";

function Pagination({ currIdx, totalIdx }: PaginationType) {
  const router = useNavigate();

  const onClickPrev = () => {
    if (currIdx === 1) {
      return;
    } else {
      router("/admin?page=1&size=10");
    }
  };

  const onClickNext = () => {
    if (currIdx >= totalIdx) {
      return;
    } else {
      router("/adin?page=2&size=10");
    }
  };

  return (
    <Wrapper>
      <PaginationContainer>
        <ArrowIcon
          src={ICON_LEFT_ARROW}
          alt="left-arrow"
          onClick={onClickPrev}
        />
        {Array.from({ length: totalIdx }).map((_, key) => {
          return <PaginationNumber key={key}>{key + 1}</PaginationNumber>;
        })}
        <ArrowIcon
          src={ICON_RIGHT_ARROW}
          alt="right-arrow"
          onClick={onClickNext}
        />
      </PaginationContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PaginationContainer = styled.div`
  width: 50%;
  height: 5em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const ArrowIcon = styled.img`
  width: 12px;
  height: 12px;
  object-fit: contain;
  color: black;
  cursor: pointer;
`;

const PaginationNumber = styled.span`
  font-size: 0.8em;
  color: black;
  cursor: pointer;
`;

export { Pagination };
