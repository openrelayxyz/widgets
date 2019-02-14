import { html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';

export default class OrSRABase extends OrWeb3Base {
  constructor() {
    super();
  }
  ready() {
    super.ready();
    this.addEventListener('sra-ready', e => this.setSRA(e));
    setTimeout(() => this.dispatchEvent(new CustomEvent('sra-child', {detail: {element: this}, bubbles: true, composed: true})));
    this._sraUpdated();
  }
  setSRA(e) {
    this.sra = e.detail.sra;
    this.feeRecipient = e.detail.feeRecipient;
    this.exchangeAddress = e.detail.exchangeAddress;
    this.epoch = e.detail.epoch;
    this.feeTokenAddress = e.detail.feeTokenAddress;
    this.wethAddress = e.detail.wethAddress;
    this.erc20ProxyAddress = e.detail.erc20ProxyAddress;
    this.erc721ProxyAddress = e.detail.erc721ProxyAddress;
    this._sraUpdated();
  }
  _sraUpdated() {
    clearTimeout(this._sraUpdatedDebounce);
    this._sraUpdatedDebounce = setTimeout(() => {
      this.sraUpdated();
    });
  }
  sraUpdated() {}
  static get properties() {
    return {
      sra: String,
      extend: function(props) {
        for(var key of Object.keys(this)) {
          props[key] = this[key];
        }
        return props;
      }
    };
  }
}
