import erc721ABI from '@openrelay/element-utilities/erc721-abi.json';
import request from "@openrelay/element-utilities/request";


export default class ERC721Metadata {
  constructor(web3) {
    this.web3 = web3;
  }
  get(address, id) {
    return new Promise((resolve, reject) => {
      let contract = this.web3.eth.contract(erc721ABI).at(address);
      contract.tokenURI(id, (err, uri) => {
        if(err) { reject(err); }
        resolve(request({url: uri}).then((result) => {
            return JSON.parse(result);
        }));
      });
    });
  }
}
