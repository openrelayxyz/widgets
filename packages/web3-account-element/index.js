import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';

export default class OrWeb3Account extends OrWeb3Base {
  static get is() { return "or-web3-account" };
  render() {
    return html`${this.account}`;
  }
  static get properties() {
    return {
      account: String
    };
  }
}

window.customElements.define(OrWeb3Account.is, OrWeb3Account)
