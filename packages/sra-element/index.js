import {html} from '@polymer/lit-element';
import OrWeb3 from '@openrelay/web3-element';

export default class OrSRA extends OrWeb3 {
  static get is() { return "or-sra" };
  static get properties() {
    return super.properties.extend({
      sra: String,
      feeRecipient: String,
    });
  }
  constructor() {
    super();
    this.sraChildren = [];
    this.sra = "https://api.openrelay.xyz/";
    this.feeRecipient = "0xc22d5b2951db72b44cfb8089bb8cd374a3c354ea";
    this.addEventListener('sra-child', e => this.registerSRAChild(e));
  }
  registerSRAChild(e) {
    this.sraChildren.push(e.detail.element);
    e.detail.element.dispatchEvent(new CustomEvent('sra-ready', {detail: {sra: this.sra, feeRecipient: this.feeRecipient}, bubbles: false, composed: false}));
  }
  _didRender(props, changedProps, prevProps) {
    if(props.sra != prevProps.sra || props.feeRecipient != prevProps.feeRecipient) {
      for(var child of this.sraChildren) {
        child.dispatchEvent(new CustomEvent('sra-ready', {detail: {sra: this.sra, feeRecipient: this.feeRecipient}, bubbles: false, composed: false}));
      }
    }
    return super._didRender(props, changedProps, prevProps);
  }
}
window.customElements.define(OrSRA.is, OrSRA)
