import {LitElement, html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import i18n from '@openrelay/sra-maker-element/i18n.json';
import '@openrelay/token-select-element';
import '@openrelay/sra-fee-element';

export default class OrSRAMaker extends OrSRABase {
  static get is() { return "or-sra-maker" };
  _render({i18n, makerToken, takerToken, makerTokenQuantity, askingPrice, expirationDateTime}) {
    let result = [
      html`<h2 style="grid-area: maker-token-header;">${i18n("Specify token offer")}</h2>`,
      html`<or-token-select style="grid-area: maker-token;" id="maker-token"></or-token-select>`,
      html`<input style="grid-area: maker-token-quantity;" id="maker-token-quantity" type="number" placeholder="${i18n("Specify Quantity")}"></input>`,
      html`<h2 style="grid-area: fee-header;">${i18n("Maker/Taker Fee Split")}</h2>`,
      html`<or-sra-fee makerToken="${makerToken ? makerToken.address : ""}" style="grid-area: fee-select;" id="fee"></or-sra-fee>`,
      html`<h2 style="grid-area: taker-token-header;">${i18n("Specify Requested Token")}</h2>`,
      html`<or-token-select style="grid-area: taker-token;" id="taker-token"></or-token-select>`,
      html`<label style="grid-area: asking-price-label;" for="asking-price">${takerToken ? takerToken.symbol : "Token"}</label>`,
      html`<input style="grid-area: asking-price;" id="asking-price" type="number" placeholder="${("Asking Price (per token)")}"></input>`,
      html`<h2 style="grid-area: expiration-header;">${i18n("Set expiration date/time")}</h2>`,
      html`<input style="grid-area: expiration-date-time;" id="expiration-date-time" type="datetime-local" min="${new Date().toISOString().split(".")[0]}"></input>`,
    ];
    if(makerTokenQuantity && makerToken && takerToken && expirationDateTime) {
      result.push(html`<h2 style="grid-area: review-header;">${i18n("Review your offer and post your order")}</h2>`);
      result.push(
        html`
        <div style="grid-area: review;" class="review">
        ${i18n("You are offering")} ${makerTokenQuantity} ${makerToken.symbol}
        ${i18n("for")} ${takerToken.symbol} ${i18n("at an asking price of")}
        ${askingPrice} ${takerToken.symbol} per ${makerToken.symbol}.
        ${i18n("Your offer is set to expire on")} ${expirationDateTime.toLocaleDateString()} ${i18n("at")} ${expirationDateTime.toLocaleTimeString()}
        </div>`
      );
    }

    return html`
      <style>
      #maker-grid {
        grid-template-areas:
          "maker-token-header maker-token-header maker-token-header"
          ". maker-token ."
          ". maker-token-quantity ."
          "fee-header fee-header fee-header"
          "fee-select fee-select fee-select"
          "taker-token-header taker-token-header taker-token-header"
          ". taker-token ."
          "asking-price-label asking-price ."
          "expiration-header expiration-header expiration-header"
          "expiration-date-time expiration-date-time expiration-date-time"
          "review-header review-header review-header"
          "review review review";
        grid-template-rows: auto 1fr auto;
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
    shadowRoot.querySelector("#maker-token").addEventListener("token-selected", (e) => {
      this.makerToken = e.detail.token;
    });
    shadowRoot.querySelector("#taker-token").addEventListener("token-selected", (e) => {
      this.takerToken = e.detail.token;
    });
    shadowRoot.querySelector("#fee").addEventListener("change", (e) => {
      this.makerFee = e.detail.makerFee;
      this.takerFee = e.detail.takerFee;
      this.feeRecipient = e.detail.feeRecipient;
    });
    shadowRoot.querySelector("#maker-token-quantity").addEventListener("change", (e) => {
      this.makerTokenQuantity = shadowRoot.querySelector("#maker-token-quantity").value;
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
      makerToken: Object,
      takerToken: Object,
      makerTokenAddress: String,
      takerTokenAddress: String,
      makerTokenQuantity: Number,
      askingPrice: String,
      expirationDateTime: Date,
    };
  }
}

window.customElements.define(OrSRAMaker.is, OrSRAMaker)
