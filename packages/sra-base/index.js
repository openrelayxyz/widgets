import { html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';

export default class OrSRABase extends OrWeb3Base {
  constructor() {
    super();
    this.sra = "https://api.openrelay.xyz/";
  }
  ready() {
    super.ready();
    this.dispatchEvent(new CustomEvent('sra-child', {detail: {element: this}, bubbles: true, composed: true}));
    this.addEventListener('sra-ready', e => this.setSRA(e));
    this.sraUpdated();
  }
  setSRA(e) {
    this.sra = e.detail.sra;
    this.feeRecipient = e.detail.feeRecipient;
    this.sraUpdated();
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