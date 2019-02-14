import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';
import erc721ABI from '@openrelay/element-utilities/erc721-abi.json';
import request from "@openrelay/element-utilities/request";

export default class OrWeb3ERC721Token extends OrWeb3Base {
  static get is() { return "or-web3-erc721-token" };
  render() {
    let content = [];
    if(this.error) {
      content.push(html`<span>error loading token: ${this.error}</span>`)
    }
    if(this.metadata) {
      if(this.metadata.name) {
        content.push(html`<h1>${this.metadata.name}</h1>`);
      }
      if(this.metadata.description) {
        content.push(html`<h2>${this.metadata.description}</h2>`);
      }
      if(this.metadata.image) {
        content.push(html`<img src="${this.metadata.image}"></img>`)
      }
      if(this.metadata.attributes) {
        let attributes = [];
        if(Array.isArray(this.metadata.attributes)) {
          for(let attribute of this.metadata.attributes) {
            attributes.push(html`<tr><td>${attribute.trait_type}</td><td>${attribute.value}</td></tr>`);
          }
        } else {
          for(let key of Object.keys(this.metadata.attributes)) {
            attributes.push(html`<tr><td>${key}</td><td>${this.metadata.attributes[key]}</td></tr>`);
          }
        }
        content.push(html`<table>${attributes}</table>`)
      }
    }
    return html`
      <div class="erc721-token">
        ${content}
        <button>List for sale</button>
      </div>
    `;
  }
  web3Updated() {
    this.contract = this.web3.eth.contract(erc721ABI).at(this.address);
    this.contract.tokenURI(this.tokenId, (err, uri) => {
      if(err) { this.error = err; return; }
      this.tokenURI = uri;
      request({url: this.tokenURI}).then((result) => {
        try {
          this.metadata = JSON.parse(result);
          this.requestUpdate();
        } catch(e) {
          this.error = e;
        }
      }).catch((error) => {
        this.error = error;
      })
    });
  }
  static get properties() {
    return {
      address: String,
      tokenId: String,
      tokenURI: String,
      metadata: Object,
    };
  }
}

window.customElements.define(OrWeb3ERC721Token.is, OrWeb3ERC721Token)
