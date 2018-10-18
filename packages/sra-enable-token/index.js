import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import request from "@openrelay/element-utilities/request";
import tokenABI from "@openrelay/element-utilities/erc20-abi.json";

const MAX_INT = "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export default class OrSRAEnableToken extends OrSRABase {
  static get is() { return "or-sra-enable-token" };
  render() {
    // TODO: Make this pretty
    return html`<button>${this.waiting ? "Pending" : (this.enabled ? "Enabled" : "Disabled") }</button>`;
  }
  constructor() {
    super();
    this.quantity = MAX_INT;
  }
  ready() {
    super.ready();
    this.waiting = false;
    this.enabled = false;
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      // TODO: Find a way to show the user the transaction ID
      this.tokenWrapper.approve(this.operatorAddress || this.erc20ProxyAddress, this.enabled ? "0" : this.quantity, (error, txid) => {
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
    if(this.token) {
      this.tokenWrapper = this.web3.eth.contract(tokenABI).at(this.token);
    } else {
      this.tokenWrapper = undefined;
    }
    if(this.tokenWrapper && this.account && (this.operatorAddress || this.erc20ProxyAddress)) {
      this.tokenWrapper.allowance(this.account, this.operatorAddress || this.erc20ProxyAddress, (err, allowance) => {
        if(!err) {
          let enabled = allowance.gte(this.quantity) || (this.quantity == MAX_INT && allowance.mul(2).gt(this.quantity));
          if (this.enabled != enabled) {
            this.waiting = false;
            this.enabled = enabled;
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

window.customElements.define(OrSRAEnableToken.is, OrSRAEnableToken)
