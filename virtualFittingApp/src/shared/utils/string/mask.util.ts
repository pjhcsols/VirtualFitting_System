export const getMaskedUserName = (name: string): string => {
  if (name.length <= 2) {
    return "*".repeat(name.length);
  }
  return `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}`;
};
