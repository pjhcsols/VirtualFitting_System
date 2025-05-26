export const verifyAuthCode = (inputCode: string, sentCode: string): boolean => {
  return inputCode === sentCode;
};
