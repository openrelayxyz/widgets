import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';
import ERC721Metadata from "@openrelay/element-utilities/erc721metadata.js";

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
      </div>
    `;
  }
  web3Updated() {
    this.erc721MetadataFetcher = new ERC721Metadata(this.web3);
    let ancestor = this.parentElement;
    while(ancestor && ancestor.tagName != "HTML") {
      if(ancestor.erc721MetadataFetcher) {
        this.erc721MetadataFetcher = ancestor.erc721MetadataFetcher;
        break;
      }
      ancestor = ancestor.parentElement || ancestor.parentNode.host;
    }
    this.erc721MetadataFetcher.get(this.address, this.tokenId).then((metadata) => {
      this.metadata = metadata;
    }).catch((error) => {
      this.error = error;
    }).then(() => {
      this.requestUpdate();
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
