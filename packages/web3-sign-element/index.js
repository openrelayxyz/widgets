import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';
import * as ethjsutil from 'ethereumjs-util';

export default class OrWeb3Sign extends OrWeb3Base {
  static get is() { return "or-web3-sign" };
  render() {
    return html`<button ?disabled="${!this.message}">Sign</button>`;
  }
  ready() {
    super.ready();
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      this.web3.eth.sign(this.account, this.message, (err, result) => {
        if(err) {
          return this.dispatch(err);
        }
        let signature = ethjsutil.toBuffer(result);
        let v = signature[64];
        if(v < 27) {
          // Some clients return v={0,1} instead of v={27,28}
          v += 27;
        }
        let r = signature.slice(0, 32);
        let s = signature.slice(32, 64);
        var msgBuffer = ethjsutil.toBuffer(this.message);
        if (this.account == this._recover(msgBuffer, v, r, s)) {
          // non-prefixed message matches EIP712
          this.dispatch(null, v, r, s, 2);
        } else if (this.account == this._recover(msgBuffer, v, s, r)) {
          // non-prefixed message matches EIP712
          // Some web3 clients return v, s, r instead of v, r, s, so we try both
          this.dispatch(null, v, s, r, 2);
        } else if (this.account == this._recover(this._prefixedMsg(msgBuffer), v, r, s)) {
          // Prefixed message matches ethsign
          this.dispatch(null, v, r, s, 3);
        } else if (this.account == this._recover(this._prefixedMsg(msgBuffer), v, s, r)) {
          // Prefixed message matches ethsign
          // Some web3 clients return v, s, r instead of v, r, s, so we try both
          this.dispatch(null, v, s, r, 3);
        } else {
          this.dispatch("Error signing message. Signature could not be verified.")
        }
      });
    });
  }
  web3Updated() {
    if(this.rawMessage && !this.message) {
      this.message = this.web3.sha3(this.rawMessage);
    }
  }
  _prefixedMsg(msgBuffer) {
    return ethjsutil.toBuffer(ethjsutil.keccak256(Buffer.concat([ethjsutil.toBuffer("\x19Ethereum Signed Message:\n32"), msgBuffer])));
  }
  _recover(msg, v, r, s) {
    try {
      let x = ethjsutil.bufferToHex(ethjsutil.pubToAddress(ethjsutil.ecrecover(msg, v, r, s)));
      return x;
    } catch (e) {
      return "badsignature";
    }
  }
  dispatch(err, v, r, s, sigType) {
    if(err) {
      this.dispatchEvent(new CustomEvent('sign', {detail: {error: err}, bubbles: true, composed: true}));
      return;
    }
    var signature = ethjsutil.bufferToHex(Buffer.concat([new Buffer([v]), r, s, new Buffer([sigType])]));
    this.value = signature;
    this.dispatchEvent(new CustomEvent('sign', {detail: {error: err, signature: signature}, bubbles: true, composed: true}));
  }
  static get properties() {
    return {
      message: {type: String},
      rawMessage: {type: String}
    };
  }
}

window.customElements.define(OrWeb3Sign.is, OrWeb3Sign)
