export const checkPassword = (value: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?])[A-Za-z\d!@#$%^&*()_+{}|:"<>?]{8,}$/;
  if (passwordRegex.test(value)) {
    return value;
  } else {
    false;
  }
};
