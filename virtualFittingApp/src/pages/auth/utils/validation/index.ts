/**
 * 이메일 주소의 유효성을 정규 표현식을 사용하여 검사하는 함수
 * @param email 검사할 문자열
 * @returns 이메일 형식에 맞으면 true, 아니면 false
 */
export function validateEmail(email: string): boolean {
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
  if (!email || email.trim() === "") {
    return false;
  }
  return emailRegex.test(email.toLowerCase());
}
