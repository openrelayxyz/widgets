import tokenList from '@openrelay/element-utilities/tokens.json';

export let symbol = {};
export let address = {};

for(let network in tokenList) {
  symbol[network] = {};
  address[network] = {};
  for(let token of tokenList[network]) {
    symbol[network][token.symbol] = token;
    address[network][token.address] = token;
  }
}
