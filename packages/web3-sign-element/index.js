import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';
import * as ethjsutil from 'ethereumjs-util';
import Signer from '@openrelay/element-utilities/signing.js';

export default class OrWeb3Sign extends OrWeb3Base {
  static get is() { return "or-web3-sign" };
  render() {
    return html`<button @click=${this.click} ?disabled="${!this.message && !this.plaintext}">Sign</button>`;
  }
  click() {
    let signer = new Signer(this.web3, this.account);
    let signature;
    if(this.plaintext) {
      signature = signer.signMessage(this.plaintext);
    } else {
      signature = signer.signMessage(this.message);
    }
    signature.then((sig) => {
      this.value = sig;
      this.dispatchEvent(new CustomEvent('sign', {detail: {signature: sig}, bubbles: true, composed: true}));
    }).catch((err) => {
      this.dispatchEvent(new CustomEvent('sign', {detail: {error: err}, bubbles: true, composed: true}));
    });
  }
  web3Updated() {
    if(this.rawMessage && !this.message) {
      this.message = this.web3.sha3(this.rawMessage);
    }
  }
  static get properties() {
    return {
      message: {type: String},
      rawMessage: {type: String},
      plaintext: {type: String},
    };
  }
}

window.customElements.define(OrWeb3Sign.is, OrWeb3Sign)
