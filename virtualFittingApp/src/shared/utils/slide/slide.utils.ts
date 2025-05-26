export const moveRight = ({
  element,
  idx,
  currIdx,
}: {
  element: HTMLElement;
  idx: number;
  currIdx: number;
}) => {
  const width = element.getBoundingClientRect().width;
  return (idx - currIdx) * width;
};

export const moveLeft = ({
  element,
  idx,
  currIdx,
}: {
  element: HTMLElement;
  idx: number;
  currIdx: number;
}) => {
  const width = element.getBoundingClientRect().width;
  return (currIdx - idx) * width;
};
