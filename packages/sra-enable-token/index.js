import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import request from "@openrelay/element-utilities/request";
import {addressValid} from "@openrelay/element-utilities/validations";
import tokenABI from "@openrelay/element-utilities/erc721-abi.json";


export default class OrSRAEnableERC721Token extends OrSRABase {
  static get is() { return "or-sra-enable-erc721-token" };
  render() {
    // TODO: Make this pretty
    return html`<button>${this.waiting ? "Pending" : (this.enabled ? "Enabled" : "Disabled") }</button>`;
  }
  constructor() {
    super();
  }
  ready() {
    super.ready();
    this.waiting = false;
    this.enabled = false;
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      this.tokenWrapper.setApprovedForAll(this.operatorAddress || this.erc721ProxyAddress, !this.enabled, {from: this.account}, (error, txid) => {
        if(error) {
          this.emitError(error);
        } else {
          this.emitTransaction(txid, "Approval pending");
          this.waiting = true;
        }
      });
    });
  }
  web3Updated() {
    this.onBlock(() => { this.updateState() });
  }
  sraUpdated() {
    this.updateState();
  }
  update(changedProps) {
    if(this.token != changedProps.get("token") || this.quantity != changedProps.get("quantity")) {
      setTimeout(() => {
        this.updateState();
      });
    }
    return super.update(changedProps);
  }
  updateState() {
    if(!this.web3) {
      return;
    }
    if(addressValid(this.token)) {
      this.tokenWrapper = this.web3.eth.contract(tokenABI).at(this.token);
    } else {
      this.tokenWrapper = undefined;
    }
    if(this.tokenWrapper && addressValid(this.account) && addressValid(this.operatorAddress || this.erc721ProxyAddress)) {
      this.tokenWrapper.isApprovedForAll(this.account, this.operatorAddress || this.erc721ProxyAddress, (err, approved) => {
        if(!err) {
            this.enabled = approved;
            this.waiting = false;
          }
        }
      });
    }
  }
  get value() {
    return this.enabled ? "enabled" : "disabled";
  }
  static get properties() {
    return super.properties.extend({
      token: {type: String},
      enabled: {type: Boolean},
      waiting: {type: Boolean},
      quantity: {type: String},
      operatorAddress: {type: String},
    });
  }
}

window.customElements.define(OrSRAEnableERC721Token.is, OrSRAEnableERC721Token)
