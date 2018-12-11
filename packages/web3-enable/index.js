import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';
import * as ethjsutil from 'ethereumjs-util';

export default class OrWeb3Enable extends OrWeb3Base {
  static get is() { return "or-web3-enable" };
  render() {
    if(this.enabled) {
      return html`Web3 Connected`;
    } else {
      return html`<button @click="${this.enable}">Connect Web3</button>`;
    }
  }
  constructor() {
    super();
    this.enabled = false;
  }
  web3Updated() {
    if(this.account) {
      this.enabled = true;
      return;
    }
    if(this.web3.currentProvider._metamask && this.web3.currentProvider._metamask.isApproved && this.web3.currentProvider._metamask.isUnlocked) {
      this.web3.currentProvider._metamask.isApproved().then((approved) => {
        if(approved) {
          this.web3.currentProvider._metamask.isUnlocked().then((unlocked) => {
            if(unlocked) {
              this.web3.currentProvider.enable().then(() => {
                this.enabled = true;
              });
            }
          });
        }
      })
    }
  }
  enable() {
    this.web3.currentProvider.enable(() => {
      this.enabled = true;
    })
  }
  static get properties() {
    return {
      enabled: {type: Boolean},
    };
  }
}

window.customElements.define(OrWeb3Enable.is, OrWeb3Enable)
