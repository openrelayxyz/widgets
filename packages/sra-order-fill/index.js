import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import request from "@openrelay/element-utilities/request";
import {fillOrKillOrder} from "@openrelay/element-utilities/submit_order";
import erc20ABI from "@openrelay/element-utilities/erc20-abi.json";
import '@openrelay/sra-enable-token';

export default class OrSRAOrderFill extends OrSRABase {
  static get is() { return "or-sra-order-fill" };
  render() {
    return html`
    <div ?hidden="${!this.order}">
      <div>Price: ${this.price ? this.price.toFixed(5) : ""} ${this.takerTokenName} / ${this.makerTokenName}</div>
      <div>Available: ${this.makerTokenAvailable} ${this.makerTokenName}</div>
      <div>Amount ${this.takerTokenName}: <input id="taker-token-amount" type="number" value="${this.takerTokenAmount}"></input> <button id="set_max">Max</button> <or-sra-enable-token token="${this.takerTokenAddress}"></or-sra-enable-token></div>
      <div hidden="${this.takerTokenAmount == "" || isNaN(this.takerTokenAmount) || this.expired}">
        <button id="submit">Submit</button>
      </div>
      <div hidden="${!this.expired}">
        This order has expired
      </div>
      <div class="status-${this.status}"></div>
    </div>
    <div ?hidden="${!!this.order}">
      Loading...
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
  ready() {
    super.ready();
    setTimeout(() => {
      this.shadowRoot.querySelector("#set_max").addEventListener("click", () => {
        // TODO: Account for takerFees when calculating max
        this.shadowRoot.querySelector("or-sra-enable-token").tokenWrapper.balanceOf(this.account, (err, balance) => {
          let value = balance;
          if(balance.gt(this.takerAssetAmountRemaining)) {
            value = this.takerAssetAmountRemaining;
          }
          this.takerTokenAmount = value.div(this.web3.toBigNumber(10).pow(this.takerTokenDecimal)).toNumber();
        });
      });
      this.shadowRoot.querySelector("#submit").addEventListener("click", () => {
        let fillAmount = this.web3.toBigNumber(this.takerTokenAmount).mul(this.web3.toBigNumber(10).pow(this.takerTokenDecimal)).round();
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
      })
    })
    this.bindToValue("#taker-token-amount", "takerTokenAmount");
  }
  sraUpdated() {
    if(this.orderHash.startsWith("0x")){
      request({
        url: `${this.sra}v2/order/${this.orderHash}`
      }).then((resultString) => {
        let result = JSON.parse(resultString);
        this.order = result.order;
        console.log(this);
        this.takerAssetAmountRemaining = this.web3.toBigNumber(result.metaData.takerAssetAmountRemaining);
        this.makerTokenAvailable = this.takerAssetAmountRemaining.mul(this.order.makerAssetAmount).div(this.order.takerAssetAmount).div(this.web3.toBigNumber(10).pow(this.makerTokenDecimal));
        this.takerTokenAddress = `0x${this.order.takerAssetData.slice(34, 74)}`;
        this.makerTokenAddress = `0x${this.order.makerAssetData.slice(34, 74)}`;
        this.expired = parseInt(this.order.expirationTimeSeconds) < (new Date().getTime() / 1000);
        let tokenBase = web3.eth.contract(erc20ABI);
        let makerTokenWrapper = tokenBase.at(this.makerTokenAddress);
        let takerTokenWrapper = tokenBase.at(this.takerTokenAddress);
        if(!this.makerTokenName) {
          makerTokenWrapper.symbol.call((err, symbol) => {
            if(!err) {
              this.makerTokenName = symbol;
            }
            console.log(err);
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
          this.price = this.web3.toBigNumber(this.order.takerAssetAmount).div(this.order.makerAssetAmount).mul(this.web3.toBigNumber(10).pow(this.makerTokenDecimal)).div(  this.web3.toBigNumber(10).pow(this.takerTokenDecimal));
        });
      });
    }
  }
  static get properties() {
    return {
      orderHash: String,
      makerTokenName: String,
      takerTokenName: String,
      makerTokenDecimal: Number,
      takerTokenDecimal: Number,
      price: Number,
      makerTokenAvailable: String,
      takerTokenAddress: String,
      takerTokenAmount: Number,
      status: String,
    };
  }
}

window.customElements.define(OrSRAOrderFill.is, OrSRAOrderFill)
