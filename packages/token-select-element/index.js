import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';
import tokenList from '@openrelay/element-utilities/tokens.json';
import request from "@openrelay/element-utilities/request";

export default class OrTokenSelect extends OrWeb3Base {
  static get is() { return "or-token-select" };
  render() {
    var tokenOptions = [html`<option value="-1">Select a token</option>`];
    if(this.tokens) {
      for(var i = 0; i < this.tokens.length; i++) {
        tokenOptions.push(html`<option value="${i}">${this.tokens[i].symbol}</option>`);
      }
    }
    let result = html`<select>${tokenOptions}</select>`;
    return result;
  }
  static get properties() {
    return {
      tokens: {type: Array},
      tokenListUrl: {type: String},
      selectedToken: {type: Object},
      selectedIndex: {type: Number},
      selectedSymbol: {type: String},
    };
  }
  ready() {
    super.ready();
    if (!this.selectedIndex) {
      this.selectedIndex = -1;
    }
    if(this.tokenListUrl) {
      this.tokens = [];
      this.initialized = request({url: this.tokenListUrl}).then((result) => {
        this.tokens = JSON.parse(result);
        this.initializeSelected();
        return this.requestUpdate();
      });
    } else {
      this.initialized = new Promise((resolve, reject) => {
        this._initializeResolve = resolve;
      });
    }
    this.shadowRoot.querySelector("select").addEventListener("change", (e) => {
      this.setToken(e.target.selectedIndex - 1);
    });
  }
  web3Updated() {
    if(!this.tokenListUrl && this.network) {
      this.initialized = Promise.resolve(null);
      // Get the current network if we have a token list, or show mainnet
      // tokens if we're on an unknown network.
      this.tokens = (tokenList[this.network] || tokenList["1"]);
      this.initializeSelected();
      this.requestUpdate().then(() => {
        return this._initializeResolve();
      })
    }
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
    return this.isReady.then(() => {
      return this.initialized.then(() => {
        this.shadowRoot.querySelector("select").value = index;
        this.selectedIndex = index;
        if(index >= 0) {
          this.selectedToken = this.tokens[index];
          this.selectedSymbol = this.selectedToken.symbol;
        } else {
          this.selctedToken = null;
          this.selectedSymbol = null;
        }
        this.dispatch();
      });
    });
  }
  dispatch() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: {token: this.selectedToken}, bubbles: false, composed: false
    }));
  }
  get value() {
    return this.selectedToken;
  }
}

window.customElements.define(OrTokenSelect.is, OrTokenSelect)
