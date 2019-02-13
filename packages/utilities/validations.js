
export const addressRegex = /^0x[0-9a-z]{40}$/;
export const numericRegex = /^\d+$/;
export const assetDataRegex = /^0x([0-9a-z]{8})[0]{24}([0-9a-z]{40})([0-9a-z]*)/

export function addressValid(value) {
  return !!addressRegex.exec(value);
}

export function numberValid(value) {
  if(value.toFixed) {
    return !!numericRegex.exec(value.toFixed())
  }
  return !!numericRegex.exec(value.toString());
}

export function assetDataValid(value) {
  let match = assetDataRegex.exec(value);
  if(!match) {
    return false;
  }
  let proxyId = match[1];
  let tokenAddress = `0x${match[2]}`;
  let extra = match[3];
  return addressValid(tokenAddress) && ((proxyId == "f47261b0" && extra.length == 0) || (proxyId == "02571792" && extra.length == 64));
}
// 0xf47261b0000000000000000000000000b98d4c97425d9908e66e53a6fdf673acca0be986
export function addressValidOrThrow(value) {
  if(!addressValid(value)) {
    throw "Invalid address " + value;
  }
  return value;
}

export function numberValidOrThrow(value) {
  if(!numberValid(value)) {
    throw "Invalid number " + value;
  }
  value.toJSON = () => value.toFixed(0);
  return value;
}

export function assetDataValidOrThrow(value) {
  if(!assetDataValid(value)) {
    throw "Invalid asset data " + value;
  }
  return value;
}
