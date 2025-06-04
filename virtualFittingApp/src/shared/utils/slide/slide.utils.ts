export const moveRight = ({
  elementWidth,
  currIdx,
  idx,
}: {
  elementWidth: number;
  currIdx: number;
  idx: number;
}) => {
  console.info(
    "[Info] moveRight Util function (elementWidth, currIdx, Idx):",
    elementWidth,
    idx,
    currIdx,
  );
  return (idx - currIdx) * elementWidth;
};

export const moveLeft = ({
  elementWidth,
  currIdx,
  idx,
}: {
  elementWidth: number;
  currIdx: number;
  idx: number;
}) => {
  console.info(
    "[Info] moveRight Util function (elementWidth, currIdx, Idx):",
    elementWidth,
    idx,
    currIdx,
  );
  return (currIdx - idx) * elementWidth;
};
