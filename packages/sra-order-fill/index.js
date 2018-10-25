import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import request from "@openrelay/element-utilities/request";
import {fillOrKillOrder} from "@openrelay/element-utilities/submit_order";
import erc20ABI from "@openrelay/element-utilities/erc20-abi.json";
import '@openrelay/sra-enable-token';
import '@openrelay/sra-signed-order';

export default class OrSRAOrderFill extends OrSRABase {
  static get is() { return "or-sra-order-fill" };
  render() {
    let result = [];
    if(this.order) {
      result.push(html`<or-sra-signed-order id="signedOrder" exchangeAddress="${this.order.exchangeAddress}" expirationTimeSeconds="${this.order.expirationTimeSeconds}" feeRecipientAddress="${this.order.feeRecipientAddress}" makerAddress="${this.order.makerAddress}" makerAssetAmount="${this.order.makerAssetAmount}" makerAssetData="${this.order.makerAssetData}" makerFee="${this.order.makerFee}" salt="${this.order.salt}" senderAddress="${this.order.senderAddress}" takerAddress="${this.order.takerAddress}" takerAssetAmount="${this.order.takerAssetAmount}" takerAssetData="${this.order.takerAssetData}" takerFee="${this.order.takerFee}" signature="${this.order.signature}" takerAssetAmountRemaining="${this.takerAssetAmountRemaining}"></or-sra-signed-order>`);
      result.push(html`<div>Amount ${this.takerTokenName}: <input id="taker-token-amount" type="number" value="${this.takerTokenAmount}"></input> <button @click="${this.setMax}">Max</button> <or-sra-enable-token token="${this.takerTokenAddress}"></or-sra-enable-token></div>`);
      result.push(html`<div ?hidden="${this.takerTokenAmount == "" || isNaN(this.takerTokenAmount) || this.expired}">
      <button @click="${this.submit}">Submit</button>
      </div>`);
    } else {
      result.push(html`<div>Loading...</div>`);
    }
    result.push(html`<div class="status-${this.status}"></div>`);
    return html`${result}`;
  }
  constructor() {
    super();
    this.takerTokenAmount = "";
    this.status = "none";
    this.orderTag = "or-sra-signed-order";
    this.order = {};
  }
  setMax() {
    let signedOrderWidget = this.shadowRoot.querySelector("#signedOrder");
    this.shadowRoot.querySelector("or-sra-enable-token").tokenWrapper.balanceOf(this.account, (err, balance) => {
      let value = balance;
      if(balance.gt(this.takerAssetAmountRemaining)) {
        value = this.takerAssetAmountRemaining;
      }
      this.takerTokenAmount = value.div(this.web3.toBigNumber(10).pow(signedOrderWidget.takerTokenDecimal)).toNumber();
    });
  }
  submit() {
    let signedOrderWidget = this.shadowRoot.querySelector("#signedOrder");
    let fillAmount = this.web3.toBigNumber(this.takerTokenAmount).mul(this.web3.toBigNumber(10).pow(signedOrderWidget.takerTokenDecimal)).round();
    this.status = "request";
    fillOrKillOrder(this.order, fillAmount.toString(), this.account, this.web3).then((txid) => {
      this.status = "pending";
      this.emitTransaction(txid, "Filling order");
      this.onConfirm(txid, (e) => {
        this.sraUpdated(); // Will trigger refresh of available amounts
        this.status = "confirmed";
      });
    }).catch((err) => {
      this.emitError(err);
    });
  }
  ready() {
    super.ready();
    this.updateComplete.then(() => {
      this.bindToValue("#taker-token-amount", "takerTokenAmount");
    });
  }
  sraUpdated() {
    if(this.orderHash.startsWith("0x")){
      request({
        url: `${this.sra}v2/order/${this.orderHash}`
      }).then((resultString) => {
        let result = JSON.parse(resultString);
        this.order = result.order;
        this.takerAssetAmountRemaining = this.web3.toBigNumber(result.metaData.takerAssetAmountRemaining);
        this.takerTokenAddress = `0x${this.order.takerAssetData.slice(34, 74)}`;
        this.expired = parseInt(this.order.expirationTimeSeconds) < (new Date().getTime() / 1000);
        let tokenBase = web3.eth.contract(erc20ABI);
        let takerTokenWrapper = tokenBase.at(this.takerTokenAddress);
        if(!this.takerTokenName) {
          takerTokenWrapper.symbol.call((err, symbol) => {
            if(!err) {
              this.takerTokenName = symbol;
            }
          });
        }
        this.requestUpdate();
      });
    }
  }
  static get properties() {
    return {
      orderHash: {type: String},
      takerTokenName: {type: String},
      makerTokenDecimal: {type: Number},
      takerTokenDecimal: {type: Number},
      makerTokenAvailable: {type: String},
      takerTokenAddress: {type: String},
      takerTokenAmount: {type: Number},
      orderTag: {type: String},
      status: {type: String},
    };
  }
}

window.customElements.define(OrSRAOrderFill.is, OrSRAOrderFill)
