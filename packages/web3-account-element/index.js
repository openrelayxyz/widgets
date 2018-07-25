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
    this.accountReady = new Promise((resolve, reject) => {
      this.resolveAccount = resolve;
    });
  }
  setAccount(e) {
    this.account = e.detail.account;
    this.resolveAccount(this.account);
    this.accountReady = Promise.resolve(this.account);
  }
}

window.customElements.define(OrWeb3Account.is, OrWeb3Account)
