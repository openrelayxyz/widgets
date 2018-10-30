import {html} from '@polymer/lit-element';
import OrWeb3 from '@openrelay/web3-element';
import exchangeABI from '@openrelay/element-utilities/0xv2-exchange-abi.json';

export default class OrSRA extends OrWeb3 {
  static get is() { return "or-sra" };
  static get properties() {
    return super.properties.extend({
      sra: {type: String},
      feeRecipient: {type: String},
      exchange: {type: String},
      sender: {type: String},
      epoch: {type: Number},
      version: {type: Number},
    });
  }
  constructor() {
    super();
    this.sraChildren = [];
    this.sender = "0x0000000000000000000000000000000000000000";
    this.sra = "https://api.openrelay.xyz/";
    this.feeRecipient = "0x74430e1338613b5a9166032cfd8f8f0a717bac67";
    this.addEventListener('sra-child', e => this.registerSRAChild(e));
    this.epochReady = this.networkReady.then(() => {
      return new Promise((resolve, reject) => {
        this.web3.eth.contract(exchangeABI).at(this.exchangeAddress).orderEpoch(this.topAccount, this.sender, (err, result) => {
          if(err) { reject(err) }
          this.epoch = result;
          resolve(result);
        })
      });
    });
  }
  registerSRAChild(e) {
    this.sraChildren.push(e.detail.element);
    this._dispatch(e.detail.element);
  }
  update(changedProps) {
    if(this.sra != changedProps.get("sra") || this.feeRecipient != changedProps.get("feeRecipient") || this.network != changedProps.get("network") || this.epoch != changedProps.get("epoch")) {
      for(var child of this.sraChildren) {
        this._dispatch(child);
      }
    }
    return super.update(changedProps);
  }
  _dispatch(element) {
    element.dispatchEvent(new CustomEvent('sra-ready', {detail: {
        sra: this.sra,
        feeRecipient: this.feeRecipient,
        exchangeAddress: this.exchangeAddress,
        feeTokenAddress: this.feeTokenAddress,
        erc20ProxyAddress: this.erc20ProxyAddress,
        wethAddress: this.wethAddress,
        epoch: this.epoch,
    }, bubbles: false, composed: false}));
  }
  get exchangeAddress() {
    return this.exchange || ({
      "1": "0x4f833a24e1f95d70f028921e27040ca56e09ab0b",
      "42": "0x35dd2932454449b14cee11a94d3674a936d5d7b2",
    })[this.network];
  }
  get feeTokenAddress() {
    // TODO: Pull this if this.exchange is not default
    return ({
      "1": "0xe41d2489571d322189246dafa5ebde1f4699f498",
      "42": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
    })[this.network];
  }
  get erc20ProxyAddress() {
    // TODO: Pull this if this.exchange is not default
    return ({
      "1": "0x2240dab907db71e64d3e0dba4800c83b5c502d4e",
      "42": "0xf1ec01d6236d3cd881a0bf0130ea25fe4234003e",
    })[this.network];
  }
  get wethAddress() {
    // TODO: Pull this if this.exchange is not default
    return ({
      "1": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "42": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    })[this.network];
  }
}
window.customElements.define(OrSRA.is, OrSRA)
