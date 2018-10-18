import {html} from '@polymer/lit-element';
import OrWeb3Base from '@openrelay/web3-base';
import erc20ABI from '@openrelay/element-utilities/erc20-abi.json';

export default class OrERC20Balance extends OrWeb3Base {
  static get is() { return "or-erc20-balance" };
  render() {
    if(this.balance) {
      console.log(this.balance.div(this._divisor).toNumber().toFixed(this.round));
      return html`${this.balance.div(this._divisor).toNumber().toFixed(this.round)}`;
    }
    return html`<span class="pending"></span>`;
  }
  static get properties() {
    return {
      account: {type: String},
      address: {type: String},
      token: {type: String},
      round: {type: Number},
      refresh: {type: Boolean},
      _divisor: {type: String},
    };
  }
  constructor() {
    super();
    this._updateInterval = null;
    this.refresh = true;
    this._divisor = 1;
    this.round = 10;
    this.balancePromise = new Promise((resolve, reject) => {
      this._balanceResolve = resolve;
      this._balanceReject = reject;
    })
  }
  ready() {
    super.ready();
    this._useAccount = !this.address;
    if(this.refresh) {
      this.onBlock(() => {
        // Refresh the balance on new blocks
        this.updateBalance();
      });
    }
  }
  web3Updated() {
    if(this.token) {
      this._tokenContract = this.web3.eth.contract(erc20ABI).at(this.token);
      this._tokenContract.decimals((err, decimals) => {
        if(!err) {
          this._divisor = this.web3.toBigNumber(10).pow(decimals);
        }
      });
      setTimeout(() => {this.updateBalance()});
    }
  }
  updateBalance() {
    let address = this._useAccount ? this.account : this.address;
    if(address && this.token) {
      this._tokenContract.balanceOf(address, (err, balance) => {
        if(!err) {
          if(balance && !this.balance || !balance.eq(this.balance)) {
            this.balance = balance;
            this.dispatchEvent(new CustomEvent('change', {detail: {value: balance}, bubbles: false, composed: false}));
            this.requestUpdate();
          }
          this._balanceResolve(balance);
        } else {
          console.log("Error getting balance:", err)
          this._balanceReject(err);
        }
      });
    }
  }
  update(changedProps) {
    if(changedProps.has("token") && changedProps.get("token") != this.token && this.web3) {
      this.web3Updated();
    }
    return super.update(changedProps);
  }
  get value() {
    return this.balance.div(this._divisor);
  }
}

window.customElements.define(OrERC20Balance.is, OrERC20Balance)
