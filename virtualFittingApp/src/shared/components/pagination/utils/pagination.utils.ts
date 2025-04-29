// limit 에 따른 2차원 배열만들기
export const sliceArrayByLimit = (totalPage: number, limit: number) => {
  const totalPageArray = Array.from({ length: totalPage }, (_, i) => i);
  const result = [];
  for (let i = 0; i < totalPage; i += limit) {
    result.push(totalPageArray.slice(i, i + limit));
  }
  return result;
};
