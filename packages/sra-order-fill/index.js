import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import request from "@openrelay/element-utilities/request";
import {fillOrKillOrder} from "@openrelay/element-utilities/submit_order";
import '@openrelay/sra-enable-token';

export default class OrSRAOrderFill extends OrSRABase {
  static get is() { return "or-sra-order-fill" };
  _render({makerTokenName, takerTokenName, makerTokenDecimal, takerTokenDecimal, price, makerTokenAvailable, takerTokenAddress, takerTokenAmount}) {
    // TODO: Calculate Price
    // TODO: Get available makerToken
    // TODO: Get takerTokenAddress
    return html`
    <div hidden="${!this.order}">
      <div>Price: ${price ? price.toFixed(5) : ""} ${takerTokenName} / ${makerTokenName}</div>
      <div>Available: ${makerTokenAvailable} ${makerTokenName}</div>
      <div>Amount ${takerTokenName}: <input id="taker-token-amount" type="number" value="${takerTokenAmount}"></input> <button id="set_max">Max</button> <or-sra-enable-token tokenAddress="${takerTokenAddress}"></or-sra-enable-token></div>
      <div hidden="${takerTokenAmount == "" || isNaN(takerTokenAmount)}">
        <button id="submit">Submit</button>
      </div>
    </div>
    <div hidden="${!!this.order}">
      Loading...
    </div>
    `;
  }
  constructor() {
    super();
    this.makerTokenDecimal = 18;
    this.takerTokenDecimal = 18;
    this.takerTokenAmount = "";
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
        fillOrKillOrder(this.order, fillAmount.toString(), this.account, this.web3).then((txid) => {
          alert(txid);
        }).catch((err) => {
          alert(err);
        });
      })
    })
    this.bindToValue("#taker-token-amount", "takerTokenAmount");
  }
  sraUpdated() {
    request({
      url: `${this.sra}v2/order/${this.orderHash}`
    }).then((resultString) => {
      let result = JSON.parse(resultString);
      this.order = result.order;
      this.price = this.web3.toBigNumber(this.order.takerAssetAmount).div(this.order.makerAssetAmount).mul(this.web3.toBigNumber(10).pow(this.takerTokenDecimal)).div(this.web3.toBigNumber(10).pow(this.makerTokenDecimal));
      this.takerAssetAmountRemaining = this.web3.toBigNumber(result.metaData.takerAssetAmountRemaining);
      this.makerTokenAvailable = this.takerAssetAmountRemaining.mul(this.order.makerAssetAmount).div(this.order.takerAssetAmount).div(this.web3.toBigNumber(10).pow(this.makerTokenDecimal));
      this.takerTokenAddress = `0x${this.order.takerAssetData.slice(34)}`;
    });
  }
  //  <or-token-sale
        // orderHash="0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658"
        // makerTokenName="AFA"
        // takerTokenName="IPPART"
        // makerTokenDecimal="2"
        // takerTokenDecimal="18"></or-token-sale>

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
    };
  }
}

window.customElements.define(OrSRAOrderFill.is, OrSRAOrderFill)
