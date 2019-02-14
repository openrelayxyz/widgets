import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import request from "@openrelay/element-utilities/request";

export default class OrSRAFee extends OrSRABase {
  static get is() { return "or-sra-fee" };
  render() {
    let makerFeeDecimal = "";
    let takerFeeDecimal = "";
    if(this.web3) {
      makerFeeDecimal = this.web3.fromWei(this.makerFee, "ether").toString();
      takerFeeDecimal = this.web3.fromWei(this.takerFee, "ether").toString();
    }
    return html`
      <div style="display: grid; grid-template-columns: 40px auto 40px">
        <div style="grid-column-start: 1;">Maker</div>
        <div style="grid-column-start: 3;">Taker</div>
        <div style="grid-column-start: 1" id="maker-fee">${makerFeeDecimal}</div>
        <input style="grid-column-start: 2" ?disabled=${this.disabled} type="range" min="0" max="100" value="${this.value}"></input>
        <div style="grid-column-start: 3" id="taker-fee">${takerFeeDecimal}</div>
      </div>
      `;
  }
  constructor() {
    super();
    this._lastFeeRequest = {};
    this.feePromise = new Promise((resolve, reject) => {
      this._resolveFee = resolve;
    });
    // this.disabled = false;
  }
  ready() {
    super.ready();
    console.log(this.value);
    if(!this.value) {
      this.value = 0;
    }
    if(this.totalFee) {
      this._initialTotalFee = this.totalFee;
    } else {
      this._initialTotalFee = null;
    }
    this.shadowRoot.querySelector("input").addEventListener("input", (e) => {
      /*
      TODO: Add sticky points, where the slider will prefer certain values like
      25, 50, and 75, which may be difficult to hit precisely otherwise.
      */
      this.value = e.target.value;
    });
    this.shadowRoot.querySelector("input").addEventListener("change", (e) => {
      this.emitChange();
    });
  }
  emitChange() {
    this.dispatchEvent(new CustomEvent("change", {detail: {
      feeRecipient: this.feeRecipient,
      makerFee: this.makerFee,
      takerFee: this.takerFee,
    }, bubbles: false, composed: false}));
  }
  get takerFee() {
    if(this.totalFee && this.totalFee.mul && this.value !== undefined) {
      return this.totalFee.mul(this.value).div("100");
    }
  }
  get makerFee() {
    if(this.totalFee && this.totalFee.mul && this.value !== undefined) {
      return this.totalFee.sub(this.totalFee.mul(this.value).div("100"));
    }
  }
  static get properties() {
    return {
      value: {type: String},
      totalFee: {type: String},

      feeRecipient: {type: String},
      makerAssetAddress: {type: String},
      takerAssetAddress: {type: String},

      account: {type: String},
      disabled: {type: Boolean},
    };
  }
  sraUpdated() {
    this.refreshFee();
  }
  web3Updated() {
    if(this.totalFee == this._initialTotalFee) {
      this.totalFee = this.web3.toBigNumber(this.totalFee);
    }
    this.accountReady.then((account) => {
      this.makerAddress = account;
      this.refreshFee();
    })
  }
  update(changedProps) {
    this.refreshFee();
    return super.update(changedProps);
  }
  refreshFee() {
    if(!this.web3 || !this.sra) {
      return;
    }
    var body = {};
    var change = false;
    for(var key of ["makerAssetAddress", "takerAssetAddress", "makerAddress", "feeRecipient"]) {
      if(this[key]) {
        body[key] = this[key];
      }
      if(body[key] != this._lastFeeRequest[key]) {
        change = true;
      }
    }
    this._lastFeeRequest = body;
    if(change || !this.totalFee) {
      request({url: this.sra + "v2/order_config", method: "post", body: JSON.stringify(body) }).then((result) => {
        var feeBody = JSON.parse(result);
        if(feeBody.feeRecipient != this.feeRecipient) {
          // If the provided fee recipieint does not match the fee recipient in
          // the response, emit an event so other elements can update.
          this.dispatchEvent(new CustomEvent('sra-fee-recipient', {detail: {elementFeeRecipient: this.feeRecipient, apiFeeRecipient: body.feeRecipient}, bubbles: true, composed: true}));
        }
        let makerFee = this.web3.toBigNumber(feeBody.makerFee);
        let takerFee = this.web3.toBigNumber(feeBody.takerFee);
        this.totalFee = makerFee.add(takerFee);
        this.value = takerFee.div(this.totalFee).mul(100).toNumber();
        if(this._initialTotalFee && this.totalFee.lt(this._initialTotalFee)) {
          // This allows app developers to set total fees higher than
          // OpenRelay's minimum
          this.totalFee = this.web3.toBigNumber(this._initialTotalFee);
        }
        this._resolveFee();
        this.emitChange();
      }).catch((error) => {
        console.log(error);
        this.dispatchEvent(new CustomEvent('sra-fee-error', {error: error, bubbles: true, composed: true}));
      });
    }
  }
}

window.customElements.define(OrSRAFee.is, OrSRAFee)
