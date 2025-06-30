export const getMaskedUserName = (name: string): string => {
  if (name.length <= 3) {
    return name;
  }
  return `${name.slice(0, 3)}${"*".repeat(name.length - 3)}`;
};

export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString("en-US");
}
