import {LitElement, html} from '@polymer/lit-element';

export default class OrWeb3Base extends LitElement {
  constructor() {
    super();
    this.addEventListener('web3-ready', e => this.setWeb3(e));
    this.addEventListener('web3-account', e => this.setAccount(e));
    this.accountReady = new Promise((resolve, reject) => {
      this.resolveAccount = resolve;
    });
  }
  ready() {
    super.ready();
    this.dispatchEvent(new CustomEvent('web3-child', {detail: {element: this}, bubbles: true, composed: true}));
  }
  setWeb3(e) {
    this.web3 = e.detail.web3;
    this.account = e.detail.account;
    this.web3Updated();
  }
  setAccount(e) {
    this.account = e.detail.account;
    this.resolveAccount(this.account);
    this.accountReady = Promise.resolve(this.account);
    this.web3Updated();
  }
  bindToValue(selector, property, transform) {
    transform = transform || (x => x);
    this.shadowRoot.querySelector(selector).addEventListener("change", (e) => {
      this[property] = transform(this.shadowRoot.querySelector(selector).value);
    })
  }
  web3Updated() {}
}
