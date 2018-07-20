import {LitElement, html} from '@polymer/lit-element';
import OrWeb3 from '@openrelay/web3-element';

export default class OrNoWeb3 extends OrWeb3 {
  static get is() { return "or-no-web3" };
  _render({hasWeb3}) {
    if(!hasWeb3) {
      return html`<slot></slot>`;
    } else {
      return html``;
    }
  }
}

window.customElements.define(OrNoWeb3.is, OrNoWeb3)
