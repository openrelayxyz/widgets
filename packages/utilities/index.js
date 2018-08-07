export function bigNumberToBuffer(value, digits=32) {
  let hexVal = value.toString(16);
  if(hexVal.length % 2 == 1) {
    hexVal = "0" + hexVal;
  }
  return Buffer.concat([Buffer.alloc(32 - (hexVal.length / 2)), new Buffer(hexVal, "hex")]);
}

export function trim(value, prefix) {
  if(value.startsWith(prefix)) { return value.slice(prefix.length); }
  return value;
}
