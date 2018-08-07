import {LitElement, html} from '@polymer/lit-element';

export default class OrWeb3Base extends LitElement {
  constructor() {
    super();
    this.addEventListener('web3-ready', e => this.setWeb3(e));
    this.addEventListener('web3-account', e => this.setAccount(e));
    this.addEventListener('web3-network', e => this.setNetwork(e));
    this.addEventListener('block', (e) => {
      for(var cb of this.blockCallbacks) {
        cb(e);
      }
    });
    this.blockCallbacks = [];
    this.accountReady = new Promise((resolve, reject) => {
      this.resolveAccount = resolve;
    });
    this.networkReady = new Promise((resolve, reject) => {
      this.resolveNetwork = resolve;
    })
  }
  ready() {
    super.ready();
    setTimeout(() => this.dispatchEvent(new CustomEvent('web3-child', {detail: {element: this}, bubbles: true, composed: true})));
  }
  setWeb3(e) {
    this.web3 = e.detail.web3;
    this.account = e.detail.account;
    this.network = e.detail.network;
    this.web3Updated();
  }
  setAccount(e) {
    this.account = e.detail.account;
    this.resolveAccount(this.account);
    this.accountReady = Promise.resolve(this.account);
    this.web3Updated();
  }
  setNetwork(e) {
    this.network = e.detail.network;
    this.resolveNetwork(this.network);
    this.networkReady = Promise.resolve(this.network);
    this.web3Updated();
  }
  bindToValue(selector, property, transform) {
    transform = transform || (x => x);
    this.shadowRoot.querySelector(selector).addEventListener("change", (e) => {
      this[property] = transform(this.shadowRoot.querySelector(selector).value);
    })
  }
  onBlock(cb) {
    this.dispatchEvent(new CustomEvent('subscribe-block', {detail: {element: this}, bubbles: true, composed: true}));
    this.blockCallbacks.push(cb);
  }
  clearBlockCallbacks() {
    this.blockCallbacks = [];
  }
  web3Updated() {}
}
