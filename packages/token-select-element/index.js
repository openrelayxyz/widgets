import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';
import tokenList from '@openrelay/element-utilities/tokens.json';
import rp from "request-promise-native";

export default class OrTokenSelect extends OrWeb3Base {
  static get is() { return "or-token-select" };
  _render({tokens}) {
    var tokenOptions = [html`<option value="-1">Select a token</option>`];
    if(tokens) {
      for(var i = 0; i < tokens.length; i++) {
        tokenOptions.push(html`<option value="${i}">${tokens[i].symbol}</option>`);
      }
    }
    let result = html`<select>${tokenOptions}</select>`;
    return result;
  }
  static get properties() {
    return {
      tokens: Array,
      tokenListUrl: String,
      selectedToken: Object,
      selectedIndex: Number,
      selectedSymbol: String,
    };
  }
  ready() {
    super.ready();
    if (!this.selectedIndex) {
      this.selectedIndex = -1;
    }
    if(this.tokenListUrl) {
      this.tokens = [];
      this.initialized = rp({uri: this.tokenListUrl, baseUrl: window.location.origin, json: true}).then((result) => {
        this.tokens = result;
        this.initializeSelected();
      });
    } else {
      this.initialized = Promise.resolve(null);
      this.tokens = tokenList;
      this.initializeSelected();
    }
    this.shadowRoot.querySelector("select").addEventListener("change", (e) => {
      this.setToken(e.target.selectedIndex - 1);
    });
  }
  initializeSelected() {
    if (this.selectedSymbol) {
      for(var i = 0; i < this.tokens.length; i++) {
        if(this.tokens[i].symbol == this.selectedSymbol) {
          this.setToken(i);
        }
      }
    } else {
      this.setToken(this.selectedIndex);
    }
  }
  setToken(index) {
    this.renderComplete.then(() => {
      this.shadowRoot.querySelector("select").value = index;
    });
    this.selectedIndex = index;
    if(index >= 0) {
      this.selectedToken = this.tokens[index];
      this.selectedSymbol = this.selectedToken.symbol;
    } else {
      this.selctedToken = null;
      this.selectedSymbol = null;
    }
    this.dispatch();
  }
  dispatch() {
    this.dispatchEvent(new CustomEvent('token-selected', {
      detail: {token: this.selectedToken}, bubbles: true, composed: true
    }));
  }
}

window.customElements.define(OrTokenSelect.is, OrTokenSelect)
