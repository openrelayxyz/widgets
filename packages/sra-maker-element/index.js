import {LitElement, html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import i18n from '@openrelay/sra-maker-element/i18n.json';
import '@openrelay/token-select-element';
import '@openrelay/web3-sign-element';
import '@openrelay/sra-fee-element';
import '@openrelay/sra-enable-token';
import UnsignedOrder from '@openrelay/element-utilities/unsignedorder';
import request from "@openrelay/element-utilities/request";

export default class OrSRAMaker extends OrSRABase {
  static get is() { return "or-sra-maker" };
  _render({i18n, makerAsset, makerAssetBalance, takerAsset, makerAssetQuantity, askingPrice, expirationDateTime, feeTokenBalance, feeTokenAddress}) {
    let result = [
      html`<h2 style="grid-area: maker-asset-header;">${i18n("Specify token offer")}</h2>`,
      html`<or-token-select style="grid-area: maker-asset;" id="maker-asset"></or-token-select>`,
      html`<input style="grid-area: maker-asset-quantity;" id="maker-asset-quantity" type="number" placeholder="${i18n("Specify Quantity")}"></input>`,
      html`<or-sra-enable-token style="grid-area: maker-asset-enable;" id="maker-asset-enable" token="${makerAsset ? makerAsset.address : ''}"></or-sra-enable-token>`,
      html`<or-erc20-balance style="grid-area: maker-asset-balance;" hide="${!makerAsset}" id="maker-asset-balance" token="${makerAsset ? makerAsset.address : ''}" round="2"></or-erc20-balance>`,
      html`<h2 style="grid-area: fee-header;">${i18n("Maker/Taker Fee Split")}</h2>`,
      html`<or-erc20-balance style="grid-area: fee-token-balance;" id="fee-token-balance" token="${feeTokenAddress}" round="2"></or-erc20-balance>`,
      html`<or-sra-enable-token style="grid-area: fee-enable;" id="fee-enable" token="${feeTokenAddress}"></or-sra-enable-token>`,
      html`<or-sra-fee makerAssetAddress="${makerAsset ? makerAsset.address : ""}" style="grid-area: fee-select;" id="fee"></or-sra-fee>`,
      html`<h2 style="grid-area: taker-asset-header;">${i18n("Specify Requested Token")}</h2>`,
      html`<or-token-select style="grid-area: taker-asset;" id="taker-asset"></or-token-select>`,
      html`<or-erc20-balance style="grid-area: taker-asset-balance;" hide="${!takerAsset}" id="taker-asset-balance" token="${takerAsset ? takerAsset.address : ''}" round="2"></or-erc20-balance>`,
      html`<label style="grid-area: asking-price-label;" for="asking-price">${takerAsset ? takerAsset.symbol : "Token"}</label>`,
      html`<input style="grid-area: asking-price;" id="asking-price" type="number" placeholder="${("Asking Price (per token)")}"></input>`,
      html`<h2 style="grid-area: expiration-header;">${i18n("Set expiration date/time")}</h2>`,
      html`<input style="grid-area: expiration-date-time;" id="expiration-date-time" type="datetime-local" min="${new Date().toISOString().split(".")[0]}"></input>`,
    ];
    if(makerAssetQuantity && makerAssetBalance && feeTokenBalance && makerAsset && takerAsset && expirationDateTime) {
      if(makerAssetBalance.lt(makerAssetQuantity)) {
        result.push(html`<h2 style="grid-area: review-header;">${i18n("Review your offer and post your order")}</h2>`);
        result.push(
          html`
          <div style="grid-area: review;" class="review">
            Your balance of ${makerAsset.symbol} is ${makerAssetBalance.toString()},
            but you are offering ${makerAssetQuantity}. Please adjust your offer to a
            quantity you can fill.
          </div>
          `
        );
      } else if(feeTokenBalance.lt(this.makerFee.div(1e18))) {
        let makerFee = this.makerFee;
        result.push(html`<h2 style="grid-area: review-header;">${i18n("Review your offer and post your order")}</h2>`);
        result.push(
          html`
          <div style="grid-area: review;" class="review">
            Your balance of ZRX is ${feeTokenBalance.toString()}, but you are
            committing to pay ${makerFee.div(1e18)}. Please adjust your offer
            to a quantity you can fill.
          </div>
          `
        );
      } else {
        let hash = this.value.hash;
        result.push(html`<h2 style="grid-area: review-header;">${i18n("Review your offer and post your order")}</h2>`);
        result.push(
          html`
          <div style="grid-area: review;" class="review">
          ${i18n("You are offering")} ${makerAssetQuantity} ${makerAsset.symbol}
          ${i18n("for")} ${takerAsset.symbol} ${i18n("at an asking price of")}
          ${askingPrice} ${takerAsset.symbol} per ${makerAsset.symbol}.
          ${i18n("Your offer is set to expire on")} ${expirationDateTime.toLocaleDateString()} ${i18n("at")} ${expirationDateTime.toLocaleTimeString()}
          </div>
          <or-web3-sign id="signature" style="grid-area: sign;" message="${hash}"></or-web3-sign>
          `
        );
      }
    }

    return html`
      <style>
      #maker-grid {
        grid-template-areas:
          "maker-asset-header maker-asset-header maker-asset-header"
          ". maker-asset maker-asset-balance"
          ". maker-asset-quantity maker-asset-enable"
          "fee-header fee-header fee-header"
          ". fee-token-balance fee-enable"
          "fee-select fee-select fee-select"
          "taker-asset-header taker-asset-header taker-asset-header"
          ". taker-asset taker-asset-balance"
          "asking-price-label asking-price ."
          "expiration-header expiration-header expiration-header"
          "expiration-date-time expiration-date-time expiration-date-time"
          "review-header review-header review-header"
          "review review review"
          ". sign .";
        grid-template-rows: auto auto auto;
        display: grid;
        border: solid;
      }
      h2 {
        font-size: 10pt;
        -webkit-margin-before: 0.2em;
        -webkit-margin-after: 0.2em;
      }
      div {
        font-size: 8pt;
      }
      </style>
      <div id="maker-grid">${result}</div>
    `;
  }
  constructor() {
    super();
    this.i18n = (t) => {
      let lang = this.lang || document.querySelector("html").lang
      if(!lang) {
        return t;
      }
      let dictionary = i18n[lang];
      if(!dictionary) {
        return t;
      } else {
        let translation = dictionary[t];
        if(translation) {
          return translation;
        } else {
          return t;
        }
      }
    }
  }
  ready() {
    super.ready();
    let shadowRoot = this.shadowRoot;
    this.bindToValue("#maker-asset", "makerAsset");
    this.bindToValue("#taker-asset", "takerAsset");
    this.bindToValue("#maker-asset-balance", "makerAssetBalance");
    this.bindToValue("#taker-asset-balance", "takerAssetBalance");
    this.bindToValue("#fee-token-balance", "feeTokenBalance");
    this.bindToValue("#maker-asset-quantity", "makerAssetQuantity");
    this.bindToValue("#asking-price", "askingPrice");
    this.bindToValue("#expiration-date-time", "expirationDateTime", x => new Date(x));
    shadowRoot.querySelector("#fee").addEventListener("change", (e) => {
      this.makerFee = e.detail.makerFee;
      this.takerFee = e.detail.takerFee;
      this.feeRecipient = e.detail.feeRecipient;
    });
    this.addEventListener("sign", (e) => {
      this.signature = e.detail.signature;
      var body = this.value;
      body.signature = this.signature;
      body.web3 = undefined;
      console.log(body);
      request({
        url: this.sra + "v2/order",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
      }).then((result) => {
        console.log("Posted");
      }).catch((error) => {
        console.log(error);
      });
    });
  }
  get value() {
    this.error = undefined;
    try {
      // TODO: Double check takerAssetAmount calculation
      let makerAssetAmount = this.web3.toBigNumber(10).pow(this.makerAsset.decimals).mul(this.makerAssetQuantity);
      // decimalAdjustedPrice = askingPrice * (10 ** makerDecimal) / (10 ** takerDecimal)
      let decimalAdjustedPrice = this.web3.toBigNumber(this.askingPrice).mul(this.web3.toBigNumber(10).pow(this.takerAsset.decimals).div(this.web3.toBigNumber(10).pow(this.makerAsset.decimals)));
      let takerAssetAmount = decimalAdjustedPrice.mul(makerAssetAmount);
      return new UnsignedOrder({
        exchangeAddress: this.exchangeAddress,
        expirationTimeSeconds: parseInt(this.expirationDateTime.getTime() / 1000),
        feeRecipientAddress: this.feeRecipient,
        makerAddress: this.account,
        makerAssetAmount: makerAssetAmount,
        makerAssetData: `0xf47261b0000000000000000000000000${this.makerAsset.address.slice(2)}`,
        makerFee: this.makerFee,
        salt: this.epoch,
        senderAddress: "0x0000000000000000000000000000000000000000", // TODO: Get this from the fee element
        takerAddress: "0x0000000000000000000000000000000000000000",  // TODO: Get this from the fee element
        takerAssetAmount: takerAssetAmount.toFixed(0),
        takerAssetData: `0xf47261b0000000000000000000000000${this.takerAsset.address.slice(2)}`,
        takerFee: this.takerFee,
      });
    } catch (e) {
      // Some values aren't set yet and validation will fail. We don't need to
      // error out, we just don't have a value yet.
      this.error = e;
      return null;
    }
  }
  static get properties() {
    return {
      i18n: Object,
      makerAsset: Object,
      takerAsset: Object,
      makerAssetAddress: String,
      takerAssetAddress: String,
      makerAssetQuantity: Number,
      askingPrice: String,
      expirationDateTime: Date,
      signature: String,
      lang: String,
      makerAssetBalance: String,
      takerAssetBalance: String,
      feeTokenBalance: String,
      feeTokenAddress: String,
      makerFee: String,
    };
  }
}

window.customElements.define(OrSRAMaker.is, OrSRAMaker)
