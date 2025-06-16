export const formatSimpleDate = (date: string): string => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return ""; 
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
