import {html} from '@polymer/lit-element';
import OrSRABase from '@openrelay/sra-base';
import request from "@openrelay/element-utilities/request";
import "@openrelay/web3-sign-element";


export default class OrSRATermsOfUse extends OrSRABase {
  static get is() { return "or-sra-terms-of-use" };
  render() {
    // TODO: Make this pretty
    if(!this.authorized) {
      return html`<textarea style="width: 80em; height: 24em;">${this.text}</textarea><p><or-web3-sign @click="${this.click}" @sign="${this.submit}" plaintext="${this.text}\n${this.time}\n0x${this.nonce}"></or-web3-sign></p>`;
    } else {
      return html`<slot>You have agreed to the terms of use.</slot>`;
    }
  }
  constructor() {
    super();
    let lang = this.lang || document.querySelector("html").lang
  }
  submit(e) {
    if(e.detail.error) {
      console.log(e);
      sraUpdated();
      return;
    }
    let response = {
      terms_id: parseInt(this.id),
      mask_id: this.maskId,
      sig: e.detail.signature,
      address: this.account,
      timestamp: `${this.time}`, // TODO: Make sure we know the nonce timestamp when they clicked sign
      nonce: `0x${this.nonce}`,
    };
    request({
      url: `${this.sra}v2/_tos`,
      method: "post",
      body: JSON.stringify(response)
    }).then(() => {
      this.authorized = true;
    }).catch((err) => {
      this.emitError(`Failed to sign terms: ${err}`)
    })


    this.sraUpdated();
  }
  click() {
    // Stop timestamp and nonce from being updated while signing is in progress
    clearInterval(this.nonceInterval);
  }
  sraUpdated() {
    if(this.sra && this.account){
      request({
        url: `${this.sra}v2/_tos/${this.account}`
      }).then((resultString) => {
        this.authorized = true;
      }).catch((error) => {
        this.authorized = false;
        return request({url: `${this.sra}v2/_tos`}).then((termsJSON) => {
          let termsObj = JSON.parse(termsJSON);
          this.text = termsObj.text;
          this.id = termsObj.id;
          this.mask = this.web3.toBigNumber(termsObj.mask);
          this.maskId = termsObj.maskId;
          clearInterval(this.nonceInterval);
          let findNonce = () => {
            // Try 100 times. If we don't find something, yield to the event
            // loop before trying again.
            for(let i=0; i < 100; i++) {
              this.new_time = parseInt((new Date()).getTime() / 1000);
              console.log("Attempt ", i);
              let nonce = new Uint8Array(32);
              crypto.getRandomValues(nonce);
              let nonceHex = Array.from (nonce).map(b => b.toString (16).padStart (2, "0")).join ("");
              let hashNum = web3.toBigNumber(web3.sha3(`${this.text}\n${this.new_time}\n0x${nonceHex}`));
              let mask = this.mask;
              let mismatch = false;
              for(let j=0; j < 256; j++) {
                if(mask.mod(2).eq(1) && !hashNum.mod(2).eq(1)) {
                  mismatch = true;
                  break;
                }
                mask = mask.div(2).floor();
                hashNum = hashNum.div(2).floor();
              }
              if(!mismatch) {
                this.time = this.new_time;
                this.nonce = nonceHex;
                this.requestUpdate();
                return;
              }
            }
            setTimeout(findNonce);
          }
          this.nonceInterval = setInterval(findNonce, 30000);
          findNonce();
        });
      });
    }
  }
  get value() {
    return this.enabled ? "enabled" : "disabled";
  }
  static get properties() {
    return super.properties.extend({
      token: {type: String},
      enabled: {type: Boolean},
      waiting: {type: Boolean},
      quantity: {type: String},
      operatorAddress: {type: String},
      authorized: {type: Boolean},
    });
  }
}

window.customElements.define(OrSRATermsOfUse.is, OrSRATermsOfUse)
