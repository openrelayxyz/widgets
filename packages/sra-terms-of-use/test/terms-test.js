import "@openrelay/web3-element";
import Terms from "@openrelay/element-utilities/terms.js";
import {getFakeWeb3} from "@openrelay/element-test-utils";
import {assert} from "chai";
import * as ethjsutil from 'ethereumjs-util';


describe('terms', () => {
  it('should sign the terms', () => {
    var web3 = getFakeWeb3(true);
    let termsSigner = new Terms("https://api.openrelay.xyz/", web3.currentProvider);
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, accounts) => {
        if(err) {
          return reject(err);
        } else {
          return resolve(accounts);
        }
      })
    }).then((accounts) => {
      return termsSigner.signTerms(accounts[0]).then((signedTerms) => {
        console.log(signedTerms);
      });
    }).catch((err) => {
      console.log(err);

    })
  });
});
