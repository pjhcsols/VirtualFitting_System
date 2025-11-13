export const cleanServerMessage = (message: string): string => {
  if (typeof message !== 'string' || !message) {
    return "";
  }

  const match = message.match(/\s+\(at\s+.*\)$/);
  
  if (match) {
    return message.substring(0, match.index).trim();
  }

  return message.trim();
};
