import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import request from "@openrelay/element-utilities/request";
import {fillOrKillOrder} from "@openrelay/element-utilities/submit_order";
import UnsignedOrder from "@openrelay/element-utilities/unsignedorder.js";
import erc20ABI from "@openrelay/element-utilities/erc20-abi.json";
import '@openrelay/sra-signed-order';
import '@openrelay/sra-enable-token';

export default class OrSRASearchResult extends OrSRABase {
  static get is() { return "or-sra-search-result" };
  render() {
    if(this.results && this.results.length > 0) {
      let results = [];
      for(let result of this.results) {
        result.clicked = () => {
          result.selected = !result.selected;
          this.emitChange(result);
          this.requestUpdate();
        }
        results.push(html`<li @click="${result.clicked}" class="${result.selected ? "selected" : "deselected"}">
          <or-sra-signed-order exchangeAddress="${result.order.exchangeAddress}" expirationTimeSeconds="${result.order.expirationTimeSeconds}" feeRecipientAddress="${result.order.feeRecipientAddress}" makerAddress="${result.order.makerAddress}" makerAssetAmount="${result.order.makerAssetAmount}" makerAssetData="${result.order.makerAssetData}" makerFee="${result.order.makerFee}" salt="${result.order.salt}" senderAddress="${result.order.senderAddress}" takerAddress="${result.order.takerAddress}" takerAssetAmount="${result.order.takerAssetAmount}" takerAssetData="${result.order.takerAssetData}" takerFee="${result.order.takerFee}" signature="${result.order.signature}" takerAssetAmountRemaining="${result.metaData.takerAssetAmountRemaining}"></or-sra-signed-order>
        </li>`);
      }
      return html`
        <ul>${results}</ul>
        <style>
          .selected {
            background-color: #EFEFFF;
          };
        </style>
      `;
    } else {
      return html`No matching orders`;
    }
  }
  sraUpdated() {
    this.updateResults();
  }
  emitChange(item) {
    this.dispatchEvent(new CustomEvent('change', {detail: {
      "value": this.value,
      "item": item,
      "selected": item.selected,
    }, bubbles: false, composed: false}));
  }
  updateResults() {
    clearTimeout(this.resultUpdateDebounce);
    this.resultUpdateDebounce = setTimeout(() => {
      let queryString = Object.keys(this.constructor.properties).filter(key => !!this[key] && this[key] != "null").map(key => key + '=' + this[key]).join('&');
      if(queryString != this.lastQueryString && this.sra.startsWith("http")) {
        request({
          url: `${this.sra}v2/orders?${queryString}`
        }).then((resultString) => {
          // TODO: Figure out how to guarantee this matches the current
          // attributes. If several changes are made rapidly, it's possible
          // that the last request to return is not the most recent request
          // made.
          this.results = JSON.parse(resultString).records;
          this.requestUpdate();
        });
        this.lastQueryString = queryString;
      }
    }, 25);
  }
  update(changedProps) {
    this.updateResults();
    super.update(changedProps);
  }
  get value() {
    return this.results.filter((item) => item.selected);
  }
  static get properties() {
    return {
      // TODO: openrelay is looking for maker= and taker=, not makerAddress and takerAddress
      makerAssetProxyId: {type: String},
      takerAssetProxyId: {type: String},
      makerAssetAddress: {type: String},
      takerAssetAddress: {type: String},
      exchangeAddress: {type: String},
      senderAddress: {type: String},
      makerAssetData: {type: String},
      takerAssetData: {type: String},
      traderAssetData: {type: String},
      makerAddress: {type: String},
      takerAddress: {type: String},
      traderAddress: {type: String},
      feeRecipientAddress: {type: String}
    };
  }
}

window.customElements.define(OrSRASearchResult.is, OrSRASearchResult);
