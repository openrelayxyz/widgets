import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import request from "@openrelay/element-utilities/request";
import tokenABI from "@openrelay/element-utilities/erc20-abi.json";

export default class OrSRAEnableToken extends OrSRABase {
  static get is() { return "or-sra-enable-token" };
  _render({enabled, waiting}) {
    // TODO: Make this pretty
    return html`<button>${waiting ? "Pending" : (enabled ? "Enabled" : "Disabled") }</button>`;
  }
  constructor() {
    super();
    this.quantity = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
  }
  ready() {
    super.ready();
    this.waiting = false;
    this.enabled = false;
    this.shadowRoot.querySelector("button").addEventListener("click", () => {
      // TODO: Find a way to show the user the transaction ID
      this.tokenWrapper.approve(this.operatorAddress || this.erc20ProxyAddress, this.enabled ? "0" : this.quantity, () => {
        this.waiting = true;
      });
    });
  }
  web3Updated() {
    this.onBlock(() => { this.updateState() });
  }
  sraUpdated() {
    this.updateState();
  }
  _didRender(props, changed, prevProps) {
    if(props.tokenAddress != prevProps.tokenAddress || props.quantity != prevProps.quantity) {
      setTimeout(() => {
        this.updateState();
      });
    }
  }
  updateState() {
    if(this.tokenAddress) {
      this.tokenWrapper = this.web3.eth.contract(tokenABI).at(this.tokenAddress);
    } else {
      this.tokenWrapper = undefined;
    }
    if(this.tokenWrapper && this.account && (this.operatorAddress || this.erc20ProxyAddress)) {
      this.tokenWrapper.allowance(this.account, this.operatorAddress || this.erc20ProxyAddress, (err, allowance) => {
        if(!err) {
          // TODO: If Quantity is maxint, consider MAXINT/2 enabled
          let enabled = allowance.gte(this.quantity);
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
      tokenAddress: String,
      enabled: Boolean,
      waiting: Boolean,
      quantity: String,
      operatorAddress: String,
    });
  }
}

window.customElements.define(OrSRAEnableToken.is, OrSRAEnableToken)
