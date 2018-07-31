import { html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';

export default class OrSRABase extends OrWeb3Base {
  ready() {
    super.ready();
    this.sra = "https://api.openrelay.xyz/";
    this.dispatchEvent(new CustomEvent('sra-child', {detail: {element: this}, bubbles: true, composed: true}));
    this.addEventListener('set-sra', e => this.setSRA(e));
  }
  setSRA(e) {
    this.sra = e.detail.sra;
  }
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
