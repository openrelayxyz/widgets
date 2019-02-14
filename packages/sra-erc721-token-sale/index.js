import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import '@openrelay/sra-terms-of-use';
import '@openrelay/sra-fee-element';
import '@openrelay/sra-enable-erc721-token';
import request from "@openrelay/element-utilities/request";
import erc721ABI from "@openrelay/element-utilities/erc721-abi.json";
import UnsignedOrder from '@openrelay/element-utilities/unsignedorder';


export default class OrSRAERC721TokenSale extends OrSRABase {
  static get is() { return "or-sra-erc721-token-sale" };
  render() {
    console.log("Render()")
    let result = [html`<button @click="${this.openSale}">List For Sale</button>`]
    if(this.open) {
      let signButton = html``;
      if(this.askingPrice > 0) {
        signButton = html`<or-web3-sign @sign="${this.onSign}" id="signature" style="grid-area: sign;" message="${this.hash}"></or-web3-sign>`;
      }
      result.push(html`<div class="sale-dialog">
        <or-sra-terms-of-use>
          <or-sra-fee hidden value="100" makerAssetAddress="${this.address}" takerAssetAddress="${this.wethAddress}" makerAddress="${this.account}"></or-sra-fee>
          <or-sra-enable-erc721-token address="${this.address}"></or-sra-enable-erc721-token>
          <span class="asking-price">Asking Price (ETH): <input @change="${this.updateAskingPrice}" type="number"></input></span>
          ${signButton}
        </or-sra-terms-of-use>
      </div>`)
    }
    console.log(result);
    return html`${result}`;
  }
  onSign(e) {
    this.order.signature = e.detail.signature;
    this.order.web3 = undefined;
    request({
      url: this.sra + "v2/order",
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(this.order),
    }).then((result) => {
      // TODO: Update the UI
      console.log("Posted");
    });
    this.order.web3 = this.web3;
  }
  openSale() {
    this.open = !this.open;
  }
  updateAskingPrice(event) {
    this.askingPrice = this.web3.toWei(event.target.value, "ether");
    this.order = new UnsignedOrder({
      exchangeAddress: this.exchangeAddress,
      expirationTimeSeconds: parseInt(new Date().getTime() / 1000) + (10*24*60*60), // Listed for 10 days
      feeRecipientAddress: this.feeRecipient,
      makerAddress: this.account,
      makerAssetAmount: 1,
      makerAssetData: `0x02571792000000000000000000000000${this.address.slice(2)}${this.idToHex(this.tokenId)}`,
      makerFee: 0,
      salt: this.epoch,
      senderAddress: "0x0000000000000000000000000000000000000000",
      takerAddress: "0x0000000000000000000000000000000000000000",
      takerAssetAmount: this.askingPrice,
      takerAssetData: `0xf47261b0000000000000000000000000${this.wethAddress.slice(2)}`,
      takerFee: this.takerFee,
    });
    this.hash = this.order.hash;

  }
  idToHex(tokenId) {
    return this.web3.toBigNumber(this.tokenId).toString(16).padStart(64, 0);
  }
  get takerFee() {
    let feeElement = this.shadowRoot.querySelector("or-sra-fee");
    return feeElement.totalFee;
  }
  static get properties() {
    return super.properties.extend({
      address: {type: String},
      tokenId: {type: String},
      open: {type: Boolean},
      askingPrice: {type: String},
    });
  }
}

window.customElements.define(OrSRAERC721TokenSale.is, OrSRAERC721TokenSale)
