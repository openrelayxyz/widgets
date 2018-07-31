import {html} from '@polymer/lit-element';
import OrWeb3 from '@openrelay/web3-element';

export default class OrSRA extends OrWeb3 {
  static get is() { return "or-sra" };
  static get properties() {
    return super.properties.extend({
      sra: String,
    });
  }
  constructor() {
    super();
    this.sraChildren = [];
    this.sra = this.sra || "https://api.openrelay.xyz/"
    this.addEventListener('sra-child', e => this.registerSRAChild(e));
  }
  registerSRAChild(e) {
    this.web3Children.push(e.detail.element);
    this.dispatchEvent(new CustomEvent('sra-ready', {detail: {sra: this.sra}, bubbles: false, composed: false}));
  }
  _didRender(props, changedProps, prevProps) {
    if(props.sra != prevProps.sra) {
      this.dispatchEvent(new CustomEvent('sra-ready', {detail: {sra: this.sra}, bubbles: false, composed: false}));
    }
    return super._didRender(props, changedProps, prevProps);
  }
}
window.customElements.define(OrSRA.is, OrSRA)
