import * as ethjsutil from 'ethereumjs-util';
import Web3 from 'web3';

export default class Signer {
  constructor(web3, account) {
    this.web3 = new Web3(web3.currentProvider);
    this.account = account;
    this.nopersonal = false;
  }
  signMessage(message) {
    return new Promise((resolve, reject) => {
      if(this.web3.personal && !this.nopersonal) {
        this.web3.personal.sign(message, this.account, (err, signature) => {
          if(err) {
            if(err.message && err.message == "Method personal_sign not supported.") {
              this.nopersonal = true;
              // Start over with this.nopersonal = true
              return resolve(this.signMessage(message));
            }
            return reject(err);
          }
          try {
            resolve(this.verify(message, signature));
          } catch (e) {
            reject(e);
          }
        })
      } else {
        this.web3.eth.sign(this.account, message, (err, signature) => {
          if(err) {
            return reject(err);
          }
          try {
            resolve(this.verify(message, signature));
          } catch (e) {
            reject(e);
          }
        })
      }
    });
  }
  verify(msg, ethSignature) {
    console.log(msg, ethSignature);
    let signature = ethjsutil.toBuffer(ethSignature);
    let v = signature[64];
    if(v < 27) {
      // Some clients return v={0,1} instead of v={27,28}
      v += 27;
    }
    let r = signature.slice(0, 32);
    let s = signature.slice(32, 64);
    var msgBuffer = ethjsutil.toBuffer(msg);
    if (this.account == this._recover(msgBuffer, v, r, s)) {
      // non-prefixed message matches EIP712
      return ethjsutil.bufferToHex(Buffer.concat([new Buffer([v]), r, s, new Buffer([2])]));
    } else if (this.account == this._recover(msgBuffer, v, s, r)) {
      // non-prefixed message matches EIP712
      // Some web3 clients return v, s, r instead of v, r, s, so we try both
      return ethjsutil.bufferToHex(Buffer.concat([new Buffer([v]), s, r, new Buffer([2])]));
    } else if (this.account == this._recover(this._prefixedMsg(msgBuffer), v, r, s)) {
      // Prefixed message matches ethsign
      return ethjsutil.bufferToHex(Buffer.concat([new Buffer([v]), r, s, new Buffer([3])]));
    } else if (this.account == this._recover(this._prefixedMsg(msgBuffer), v, s, r)) {
      // Prefixed message matches ethsign
      // Some web3 clients return v, s, r instead of v, r, s, so we try both
      return ethjsutil.bufferToHex(Buffer.concat([new Buffer([v]), s, r, new Buffer([3])]));
    } else {
      throw "Error signing message. Signature could not be verified.";
    }
  }
  _recover(msg, v, r, s) {
    try {
      console.log(msg, v, r, s);
      let x = ethjsutil.bufferToHex(ethjsutil.pubToAddress(ethjsutil.ecrecover(msg, v, r, s)));
      console.log(x);
      return x;
    } catch (e) {
      console.log(e);
      return "badsignature";
    }
  }
  _prefixedMsg(msgBuffer) {
    return ethjsutil.toBuffer(ethjsutil.keccak256(Buffer.concat([ethjsutil.toBuffer(`\x19Ethereum Signed Message:\n${msgBuffer.length}`), msgBuffer])));
  }
}
