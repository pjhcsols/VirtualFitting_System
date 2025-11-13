const ORIGINAL_BASE_URL_PATTERN = /^https?:\/\/basilium\.co\.kr:8080/;
const NEW_BASE_URL = 'https://api.basilium.ai.kr';

export const getCorrectedImageUrl = (originalUrl: string): string => {
  if (typeof originalUrl !== 'string' || !originalUrl) {
    return originalUrl;
  }
  const correctedUrl = originalUrl.replace(ORIGINAL_BASE_URL_PATTERN, NEW_BASE_URL);

  return correctedUrl;
};