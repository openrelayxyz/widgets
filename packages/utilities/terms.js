import request from "@openrelay/element-utilities/request";
import Signer from "@openrelay/element-utilities/signing.js";
import Web3 from 'web3';

export default class Terms {
  constructor(sra, web3Provider) {
    this.web3 = new Web3(web3Provider);
    this.sra = sra;
  }
  authorized(account) {
    request({
      url: `${this.sra}v2/_tos/${account}`
    }).then(() => {
      return true;
    }).catch(() => {
      return false;
    })
  }
  getTerms() {
    return request({url: `${this.sra}v2/_tos`}).then((termsJSON) => {
      return JSON.parse(termsJSON);
    });
  }
  signTerms(address) {
    let signer = new Signer(this.web3, address);
    return this.findNonce(this.getTerms()).then((termsNonce) => {
      console.log(termsNonce);
      return signer.signMessage(`${termsNonce.terms.text}\n${termsNonce.time}\n0x${termsNonce.nonce}`).then((signature) => {
        return {signature: signature, termsNonce: termsNonce, account: address};
      });
    });
  }
  uploadSignedTerms(signedTerms) {
    let response = {
      terms_id: parseInt(signedTerms.termsNonce.terms.id),
      mask_id: signedTerms.termsNonce.terms.maskId,
      sig: signedTerms.signature,
      address: signedTerms.account,
      timestamp: `${signedTerms.termsNonce.time}`,
      nonce: `${signedTerms.termsNonce.nonce}`,
    };
    return request({
      url: `${this.sra}v2/_tos`,
      method: "post",
      body: JSON.stringify(response)
    }).then(() => {
      return true;
    });
  }
  signAndUpload(address) {
    return this.signTerms(address).then((signedTerms) => {
      return this.uploadSignedTerms(signedTerms);
    });
  }
  findNonce(terms) {
    return Promise.resolve(terms).then((terms) => {
      let _findNonce = (resolve) => {
        // Try 100 times. If we don't find something, yield to the event
        // loop before trying again.
        for(let i=0; i < 100; i++) {
          let new_time = parseInt((new Date()).getTime() / 1000);
          console.log("Attempt ", i);
          let nonce = new Uint8Array(32);
          crypto.getRandomValues(nonce);
          let nonceHex = Array.from (nonce).map(b => b.toString (16).padStart (2, "0")).join ("");
          let hashNum = this.web3.toBigNumber(this.web3.sha3(`${terms.text}\n${new_time}\n0x${nonceHex}`));
          let mask = this.web3.toBigNumber(terms.mask);
          let mismatch = false;
          for(let j=0; j < 256; j++) {
            if(mask.mod(2).eq(1) && !hashNum.mod(2).eq(1)) {
              mismatch = true;
              break;
            }
            mask = mask.div(2).floor();
            hashNum = hashNum.div(2).floor();
          }
          if(!mismatch) {
            return resolve({time: new_time, nonce: nonceHex, terms: terms});
          }
        }
        setTimeout(() => {
          _findNonce(resolve);
        });
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          _findNonce(resolve);
        });
      })
    })
  }

}
