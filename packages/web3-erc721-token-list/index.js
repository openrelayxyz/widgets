import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';
import erc721ABI from '@openrelay/element-utilities/erc721-abi.json';
import '@openrelay/web3-erc721-token';

export default class OrWeb3ERC721TokenList extends OrWeb3Base {
  static get is() { return "or-web3-erc721-token-list" };
  render() {
    let items = this.items.map((item) => html`<li><or-web3-erc721-token address="${this.address}" tokenId="${item}"></or-web3-erc721-token>`);
    if(items.length == 0) {
      return html`<slot>Uh oh, you don't have any</slot>`;
    }
    return html`<ul>${items}</ul>`;
  }
  constructor() {
    super();
    this.items = [];
  }
  web3Updated() {
    this.tokenOwner = this.owner || this.account;
    this.contract = this.web3.eth.contract(erc721ABI).at(this.address);
    this.items = [];
    this.contract.balanceOf(this.tokenOwner, (err, count) => {
      let itemPromises = [];
      for(var i = 0; i < count.toNumber(); i++) {
        itemPromises.push(new Promise((resolve, reject) => {
          this.contract.tokenOfOwnerByIndex(this.tokenOwner, i, (err, tokenIndex) => {
            if(err) { reject(err); return; }
            resolve(tokenIndex);
          });
        }));
      }
      Promise.all(itemPromises).then((indexes) => {
        this.items = indexes.map((item) => item.toFixed(0));
        this.requestUpdate();
      })
    });
  }
  static get properties() {
    return {
      address: String,
      owner: String,
      tokenOwner: String,
      items: Array,
    };
  }
}

window.customElements.define(OrWeb3ERC721TokenList.is, OrWeb3ERC721TokenList)
