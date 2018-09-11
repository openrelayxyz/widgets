import {html} from '@polymer/lit-element';
import OrWeb3 from '@openrelay/web3-element';
import exchangeABI from '@openrelay/element-utilities/0xv2-exchange-abi.json';

export default class OrSRA extends OrWeb3 {
  static get is() { return "or-sra" };
  static get properties() {
    return super.properties.extend({
      sra: String,
      feeRecipient: String,
      exchange: String,
      sender: String,
      epoch: Number,
      version: Number,
    });
  }
  constructor() {
    super();
    this.sraChildren = [];
    this.sender = "0x0000000000000000000000000000000000000000";
    this.sra = "https://api.openrelay.xyz/";
    this.feeRecipient = "0xc22d5b2951db72b44cfb8089bb8cd374a3c354ea";
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
  _didRender(props, changedProps, prevProps) {
    if(props.sra != prevProps.sra || props.feeRecipient != prevProps.feeRecipient || props.network != prevProps.network || props.epoch != prevProps.epoch) {
      for(var child of this.sraChildren) {
        this._dispatch(child);
      }
    }
    return super._didRender(props, changedProps, prevProps);
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
      "42": "0xa458ec0709468996ef2ef668f5e52f37ceb66627",
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
      "42": "0x9ad1b8209cea603892c9dfaa676bc737088b499a",
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
