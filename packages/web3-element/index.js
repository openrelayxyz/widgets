import {LitElement, html} from '@polymer/lit-element';

export default class OrWeb3 extends LitElement {
  static get is() { return "or-web3" };
  _render({hasWeb3}) {
    if(hasWeb3) {
      return html`<slot></slot>`;
    } else {
      return html`<slot name="noweb3">You need web3 to view this content</slot>`;
    }
  }
  static get properties() { return {
    hasWeb3: Boolean,
    accountCheckInterval: {type: Number, value: 2000},
    extend: function(props) {
      for(var key of Object.keys(this)) {
        props[key] = this[key];
      }
      return props;
    }
  }}
  constructor() {
    super();
    this.web3Children = [];
    this.addEventListener('web3-child', e => this.registerChild(e));
    this.addEventListener('set-web3', e => this.setWeb3(e.detail.web3));
    this.hasWeb3 = false;
    this.topAccount = null;
    this.network = null;
    this.web3Interval = setInterval(() => {
      if(window.web3 != undefined) {
        this.setWeb3(window.web3);
      }
    }, 100)
  }
  registerChild(e) {
    this.web3Children.push(e.detail.element);
    if(this.hasWeb3) {
      e.detail.element.dispatchEvent(new CustomEvent('web3-ready', {detail: {web3: this.web3, account: this.topAccount}, bubbles: false, composed: false}));
    }
  }
  setWeb3(web3) {
    this.hasWeb3 = true;
    this.web3 = new Web3(web3.currentProvider);
    clearInterval(this.web3Interval);
    for(var child of this.web3Children) {
      child.dispatchEvent(new CustomEvent('web3-ready', {detail: {web3: this.web3}, bubbles: false, composed: false}));
    }
    this.watchAccounts();
  }
  watchAccounts() {
    var getAccount = () => {
      try {
        // This is faster with some web3 providers, but not always available
        if(this.topAccount != this.web3.eth.accounts[0]) {
          this.setAccount(accounts[0]);
        }
      } catch(e) {
        // This is always available, but not performant with some web3 providers
        this.web3.eth.getAccounts((err, accounts) => {
          if(this.topAccount != accounts[0]) {
            this.setAccount(accounts[0]);
          }
        })
      }
    }
    getAccount();
    setInterval(() => getAccount(), this.accountCheckInterval);
  }
  setAccount(account) {
    this.topAccount = account;
    for(var child of this.web3Children) {
      child.dispatchEvent(new CustomEvent('web3-account', {detail: {account: this.topAccount}, bubbles: false, composed: false}));
    }
  }
}
window.customElements.define(OrWeb3.is, OrWeb3)
