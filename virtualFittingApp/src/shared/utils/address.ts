export const splitAddressString = (combinedAddress: string | null | undefined): { zonecode: string; address: string; detailAddress: string } => {
  const defaultResult = { zonecode: "", address: "", detailAddress: "" };
  if (!combinedAddress) {
    return defaultResult;
  }

  let zonecode = "";
  let remainingAddress = combinedAddress;

  const zonecodeMatch = remainingAddress.match(/^(\d{5})\s(.+)/);
  if (zonecodeMatch) {
    zonecode = zonecodeMatch[1];
    remainingAddress = zonecodeMatch[2].trim();
  }

  let address = "";
  let detailAddress = "";

  const detailAddressMatch = remainingAddress.match(/(.*(?:로|길|대로)\s\d+(?:-\d+)?)\s((?:[가-힣\d\s\-\.]+)$)/);
  
  if (detailAddressMatch) {
    address = detailAddressMatch[1].trim();
    detailAddress = detailAddressMatch[2].trim();
  } else {
    address = remainingAddress;
  }

  const parts = address.split(' ').filter(p => p.length > 0);
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    if (/\d/.test(lastPart) && lastPart.length < 10) {
      detailAddress = (detailAddress ? detailAddress + ' ' : '') + lastPart;
      address = parts.slice(0, parts.length - 1).join(' ');
    }
  }
  return { zonecode, address, detailAddress };
};