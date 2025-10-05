export const getQueryParameter = (query: string) => {
  const params = new URLSearchParams(query);
  const page: number = Number(params.get("page"));
  const size: number = Number(params.get("size"));
  return {
    page,
    size,
  };
};
