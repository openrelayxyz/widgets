import {LitElement, html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import i18n from '@openrelay/sra-maker-element/i18n.json';
import '@openrelay/token-select-element';
import '@openrelay/sra-fee-element';

export default class OrSRAMaker extends OrSRABase {
  static get is() { return "or-sra-maker" };
  _render({i18n, makerAsset, takerAsset, makerAssetQuantity, askingPrice, expirationDateTime}) {
    let result = [
      html`<h2 style="grid-area: maker-asset-header;">${i18n("Specify token offer")}</h2>`,
      html`<or-token-select style="grid-area: maker-asset;" id="maker-asset"></or-token-select>`,
      html`<input style="grid-area: maker-asset-quantity;" id="maker-asset-quantity" type="number" placeholder="${i18n("Specify Quantity")}"></input>`,
      html`<h2 style="grid-area: fee-header;">${i18n("Maker/Taker Fee Split")}</h2>`,
      html`<or-sra-fee makerAssetAddress="${makerAsset ? makerAsset.address : ""}" style="grid-area: fee-select;" id="fee"></or-sra-fee>`,
      html`<h2 style="grid-area: taker-asset-header;">${i18n("Specify Requested Token")}</h2>`,
      html`<or-token-select style="grid-area: taker-asset;" id="taker-asset"></or-token-select>`,
      html`<label style="grid-area: asking-price-label;" for="asking-price">${takerAsset ? takerAsset.symbol : "Token"}</label>`,
      html`<input style="grid-area: asking-price;" id="asking-price" type="number" placeholder="${("Asking Price (per token)")}"></input>`,
      html`<h2 style="grid-area: expiration-header;">${i18n("Set expiration date/time")}</h2>`,
      html`<input style="grid-area: expiration-date-time;" id="expiration-date-time" type="datetime-local" min="${new Date().toISOString().split(".")[0]}"></input>`,
    ];
    if(makerAssetQuantity && makerAsset && takerAsset && expirationDateTime) {
      result.push(html`<h2 style="grid-area: review-header;">${i18n("Review your offer and post your order")}</h2>`);
      result.push(
        html`
        <div style="grid-area: review;" class="review">
        ${i18n("You are offering")} ${makerAssetQuantity} ${makerAsset.symbol}
        ${i18n("for")} ${takerAsset.symbol} ${i18n("at an asking price of")}
        ${askingPrice} ${takerAsset.symbol} per ${makerAsset.symbol}.
        ${i18n("Your offer is set to expire on")} ${expirationDateTime.toLocaleDateString()} ${i18n("at")} ${expirationDateTime.toLocaleTimeString()}
        </div>`
      );
    }

    return html`
      <style>
      #maker-grid {
        grid-template-areas:
          "maker-asset-header maker-asset-header maker-asset-header"
          ". maker-asset ."
          ". maker-asset-quantity ."
          "fee-header fee-header fee-header"
          "fee-select fee-select fee-select"
          "taker-asset-header taker-asset-header taker-asset-header"
          ". taker-asset ."
          "asking-price-label asking-price ."
          "expiration-header expiration-header expiration-header"
          "expiration-date-time expiration-date-time expiration-date-time"
          "review-header review-header review-header"
          "review review review";
        grid-template-rows: auto atuo auto;
        display: grid;
      };
      </style>
      <div id="maker-grid">${result}</div>
    `;
  }
  constructor() {
    super();
    this.i18n = (t) => {
      if(!document.querySelector("html").lang) {
        return t;
      }
      let dictionary = i18n[document.querySelector("html").lang];
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
    shadowRoot.querySelector("#maker-asset").addEventListener("token-selected", (e) => {
      this.makerAsset = e.detail.token;
    });
    shadowRoot.querySelector("#taker-asset").addEventListener("token-selected", (e) => {
      this.takerAsset = e.detail.token;
    });
    shadowRoot.querySelector("#fee").addEventListener("change", (e) => {
      this.makerFee = e.detail.makerFee;
      this.takerFee = e.detail.takerFee;
      this.feeRecipient = e.detail.feeRecipient;
    });
    shadowRoot.querySelector("#maker-asset-quantity").addEventListener("change", (e) => {
      this.makerAssetQuantity = shadowRoot.querySelector("#maker-asset-quantity").value;
    })
    shadowRoot.querySelector("#asking-price").addEventListener("change", (e) => {
      this.askingPrice = shadowRoot.querySelector("#asking-price").value;
    })
    shadowRoot.querySelector("#expiration-date-time").addEventListener("change", (e) => {
      this.expirationDateTime = new Date(shadowRoot.querySelector("#expiration-date-time").value);
    })
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
    };
  }
}

window.customElements.define(OrSRAMaker.is, OrSRAMaker)
