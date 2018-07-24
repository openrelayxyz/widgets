import {LitElement, html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';

export default class OrWeb3Account extends OrWeb3Base {
  static get is() { return "or-web3-account" };
  _render({account}) {
    let result = html`${account}`;
    return result;
  }
  static get properties() {
    return {
      account: String
    };
  }
  ready() {
    super.ready();
    this.addEventListener('web3-account', e => this.setAccount(e));
  }
  setAccount(e) {
    this.account = e.detail.account;
  }
}

window.customElements.define(OrWeb3Account.is, OrWeb3Account)
