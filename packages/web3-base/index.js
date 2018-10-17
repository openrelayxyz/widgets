import {LitElement} from '@polymer/lit-element';

export default class OrWeb3Base extends LitElement {
  constructor() {
    super();
    this.addEventListener('web3-ready', e => this.setWeb3(e));
    this.addEventListener('web3-account', e => this.setAccount(e));
    this.addEventListener('web3-tx-confirm', e => this.txConfirm(e));
    this.addEventListener('web3-network', e => this.setNetwork(e));
    this.addEventListener('block', (e) => {
      for(var cb of this.blockCallbacks) {
        cb(e);
      }
    });
    this.blockCallbacks = [];
    this.confirmCallbacks = {};
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
    this._web3Updated();
  }
  setAccount(e) {
    this.account = e.detail.account;
    this.resolveAccount(this.account);
    this.accountReady = Promise.resolve(this.account);
    this._web3Updated();
  }
  setNetwork(e) {
    this.network = e.detail.network;
    this.resolveNetwork(this.network);
    this.networkReady = Promise.resolve(this.network);
    this._web3Updated();
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
  txConfirm(e) {
    this.dispatchEvent(new CustomEvent('web3-tx-confirm', {detail: {element: this, txid: e.detail.transaction.id}, bubbles: true, composed: true}));
    if(this.confirmCallbacks[e.detail.transaction.id]) {
      this.confirmCallbacks[e.detail.transaction.id](e);
    }
  }
  onConfirm(txid, callback) {
    this.confirmCallbacks[txid] = callback;
  }
  emitTransaction(txid, message) {
    this.dispatchEvent(new CustomEvent('web3-transaction', {detail: {
      element: this,
      transaction: {id: txid, message: message}
    }, bubbles: true, composed: true}));
  }
  emitError(error) {
    this.dispatchEvent(new CustomEvent('web3-error', {detail: {
      element: this,
      error: error
    }, bubbles: true, composed: true}));
  }
  _web3Updated() {
    clearTimeout(this._web3UpdatedDebounce);
    setTimeout(() => {
      this.web3Updated();
    })
  }
  web3Updated() {}
}
