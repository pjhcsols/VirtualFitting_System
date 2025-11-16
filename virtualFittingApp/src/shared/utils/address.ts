export const splitAddressString = (combinedAddress: string | null | undefined): { zonecode: string; address: string; detailAddress: string } => {
  const defaultResult = { zonecode: "", address: "", detailAddress: "" };
  if (!combinedAddress) {
    return defaultResult;
  }

  const zonecodeMatch = combinedAddress.match(/^(\d{5})\s/);
  
  if (zonecodeMatch) {
    const zonecode = zonecodeMatch[1];
    let addressPart = combinedAddress.substring(zonecode.length).trim();

    const parts = addressPart.split(/\s+/);
    const lastPart = parts[parts.length - 1];
    
    if (parts.length > 1 && (/\d/g.test(lastPart) || lastPart.length < 5)) {
      const detailAddress = lastPart;
      const address = parts.slice(0, parts.length - 1).join(' ');
      return { zonecode, address, detailAddress };
    } else {
      return { zonecode, address: addressPart, detailAddress: "" };
    }
  }
  return { zonecode: "", address: combinedAddress, detailAddress: "" };
};