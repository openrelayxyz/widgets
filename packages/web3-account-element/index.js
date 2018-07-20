import {LitElement, html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';

export default class OrWeb3Account extends OrWeb3Base {
  static get is() { return "or-web3-account" };
  _render({account}) {
    console.log("Rendering", account);
    let result = html`${account}`;
    // <style>
    //   .web3-account {
    //     color: var(--web3-account-color, yellow);
    //   }
    // </style>
    // <span class="web3-account">${account}</span>
    console.log(result);
    return result;
  }
  static get properties() {
    return {
      account: String
    };
  }
  ready() {
    super.ready();
    // this.dispatchEvent(new CustomEvent('web3-child', {detail: {element: this}, bubbles: true, composed: true}));
    this.addEventListener('web3-account', e => this.setAccount(e));
  }
  setAccount(e) {
    this.account = e.detail.account;
  }
}

window.customElements.define(OrWeb3Account.is, OrWeb3Account)
