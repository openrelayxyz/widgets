import {LitElement, html} from '@polymer/lit-element';

export default class OrWeb3Base extends LitElement {
  ready() {
    super.ready();
    this.dispatchEvent(new CustomEvent('web3-child', {detail: {element: this}, bubbles: true, composed: true}));
    this.addEventListener('set-web3', e => this.setWeb3(e));
  }
  setWeb3(e) {
    this.web3 = e.detail.web3;
    this.account = e.detail.account;
  }
}
