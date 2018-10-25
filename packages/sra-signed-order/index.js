import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import request from "@openrelay/element-utilities/request";
import {fillOrKillOrder} from "@openrelay/element-utilities/submit_order";
import UnsignedOrder from "@openrelay/element-utilities/unsignedorder.js";
import erc20ABI from "@openrelay/element-utilities/erc20-abi.json";
import '@openrelay/sra-enable-token';

export default class OrSRASignedOrderBase extends OrSRABase {
  static get is() { return "or-sra-signed-order" };
  render() {
    return html`
      <div>Price: ${this.price ? this.price.toFixed(5) : ""} <span title="${this.takerTokenAddress}">${this.takerTokenName}</span> / <span title="${this.makerTokenAddress}">${this.makerTokenName}></span></div>
      <div>Available: ${this.makerTokenAvailable} ${this.makerTokenName}</div>
      <div ?hidden="${!this.expired}">
        This order has expired
      </div>
    `;
  }
  constructor() {
    super();
    this.makerTokenDecimal = 18;
    this.takerTokenDecimal = 18;
    this.takerTokenAmount = "";
    this.status = "none";
  }
  sraUpdated() {
    if(this.web3 && this.takerAssetAmountRemaining && this.takerAssetAmountRemaining != "undefined") {
      let takerAssetAmountRemaining = this.web3.toBigNumber(this.takerAssetAmountRemaining);
      this.makerTokenAvailable = takerAssetAmountRemaining.mul(this.makerAssetAmount).div(this.takerAssetAmount).div(this.web3.toBigNumber(10).pow(this.makerTokenDecimal));
      this.takerTokenAddress = `0x${this.takerAssetData.slice(34, 74)}`;
      this.makerTokenAddress = `0x${this.makerAssetData.slice(34, 74)}`;
      this.expired = this.web3.toBigNumber(this.expirationTimeSeconds).lt(new Date().getTime() / 1000);
      let tokenBase = web3.eth.contract(erc20ABI);
      let makerTokenWrapper = tokenBase.at(this.makerTokenAddress);
      let takerTokenWrapper = tokenBase.at(this.takerTokenAddress);
      if(!this.makerTokenName) {
        makerTokenWrapper.symbol.call((err, symbol) => {
          if(!err) {
            this.makerTokenName = symbol;
            this.requestUpdate();
          } else {
            console.log(err);
          }
        });
      }
      let makerTokenDecimal = new Promise((resolve, reject) => {
        if(this.makerTokenDecimal == 18){
          makerTokenWrapper.decimals.call((err, decimals) => {
            if(!err) {
              this.makerTokenDecimal = decimals;
              resolve(decimals);
            }
            else {
              reject(err);
            }
          });
        } else {
          resolve(18);
        }
      });
      if(!this.takerTokenName) {
        takerTokenWrapper.symbol.call((err, symbol) => {
          if(!err) {
            this.takerTokenName = symbol;
            this.requestUpdate();
          }
        });
      }
      let takerTokenDecimal = new Promise((resolve, reject) => {
        if(this.takerTokenDecimal == 18) {
          takerTokenWrapper.decimals.call((err, decimals) => {
            if(!err) {
              this.takerTokenDecimal = decimals;
              resolve(decimals);
            } else {
              reject(err);
            }
          });
        } else {
          resolve(18);
        }
      });
      Promise.all([makerTokenDecimal, takerTokenDecimal]).then(() => {
        this.price = this.web3.toBigNumber(this.takerAssetAmount).div(this.makerAssetAmount).mul(this.web3.toBigNumber(10).pow(this.makerTokenDecimal)).div(  this.web3.toBigNumber(10).pow(this.takerTokenDecimal));
        this.requestUpdate();
      });
    }
  }
  update(changedProps) {
    if((changedProps.has("exchangeAddress") && changedProps.get("exchangeAddress") != this["exchangeAddress"]) ||
      (changedProps.has("expirationTimeSeconds") && changedProps.get("expirationTimeSeconds") != this["expirationTimeSeconds"]) ||
      (changedProps.has("feeRecipientAddress") && changedProps.get("feeRecipientAddress") != this["feeRecipientAddress"]) ||
      (changedProps.has("makerAddress") && changedProps.get("makerAddress") != this["makerAddress"]) ||
      (changedProps.has("makerAssetAmount") && changedProps.get("makerAssetAmount") != this["makerAssetAmount"]) ||
      (changedProps.has("makerAssetData") && changedProps.get("makerAssetData") != this["makerAssetData"]) ||
      (changedProps.has("makerFee") && changedProps.get("makerFee") != this["makerFee"]) ||
      (changedProps.has("salt") && changedProps.get("salt") != this["salt"]) ||
      (changedProps.has("senderAddress") && changedProps.get("senderAddress") != this["senderAddress"]) ||
      (changedProps.has("takerAddress") && changedProps.get("takerAddress") != this["takerAddress"]) ||
      (changedProps.has("takerAssetAmount") && changedProps.get("takerAssetAmount") != this["takerAssetAmount"]) ||
      (changedProps.has("takerAssetData") && changedProps.get("takerAssetData") != this["takerAssetData"]) ||
      (changedProps.has("takerFee") && changedProps.get("takerFee") != this["takerFee"]) ||
      (changedProps.has("takerAssetAmountRemaining") && changedProps.get("takerAssetAmountRemaining") != this["takerAssetAmountRemaining"])) {
        this.sraUpdated()
      }
    return super.update(changedProps);
  }
  static get properties() {
    return {
      exchangeAddress: {type: String},
      expirationTimeSeconds: {type: String},
      feeRecipientAddress: {type: String},
      makerAddress: {type: String},
      makerAssetAmount: {type: String},
      makerAssetData: {type: String},
      makerFee: {type: String},
      salt: {type: String},
      senderAddress: {type: String},
      takerAddress: {type: String},
      takerAssetAmount: {type: String},
      takerAssetData: {type: String},
      takerFee: {type: String},
      takerAssetAmountRemaining: {type: String},
    };
  }
}

window.customElements.define(OrSRASignedOrderBase.is, OrSRASignedOrderBase)
